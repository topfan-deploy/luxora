import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation/schemas";
import { generateOrderNumber } from "@/lib/utils/format";
import { stripe } from "@/lib/stripe";
import { getMobileMoneyAdapter } from "@/lib/payments/mobile-money/adapter";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { shippingAddress, billingAddress, paymentMethod, phoneNumber, notes } =
      validation.data;

    // Fetch user's cart with product details
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `"${item.product.name}" is no longer available` },
          { status: 400 }
        );
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals from price snapshots
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));
    const orderNumber = generateOrderNumber();

    // Use a transaction for atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create the order with item snapshots
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          subtotal,
          tax,
          shipping,
          total,
          currency: "USD",
          paymentMethod,
          paymentStatus: "PENDING",
          userId: session.user.id,
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
          notes: notes || null,
          items: {
            create: cart.items.map((item) => ({
              quantity: item.quantity,
              price: item.product.price,
              productName: item.product.name,
              productImage: item.product.images[0]?.url || null,
              productSlug: item.product.slug,
              productId: item.product.id,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Handle payment method specific logic
    if (paymentMethod === "CARD") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Stripe expects cents
        currency: "usd",
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: session.user.id,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentIntentId: paymentIntent.id },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
        paymentMethod: "CARD",
      });
    }

    if (paymentMethod === "PAYPAL") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: "PAYPAL",
        total,
        currency: "USD",
      });
    }

    if (paymentMethod === "MPESA" || paymentMethod === "MTN_MOMO") {
      if (!phoneNumber) {
        return NextResponse.json(
          { error: "Phone number is required for mobile money payments" },
          { status: 400 }
        );
      }

      const adapter = getMobileMoneyAdapter(paymentMethod);
      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mobile-money`;

      const result = await adapter.initiatePayment({
        amount: total,
        currency: paymentMethod === "MPESA" ? "KES" : "EUR",
        phoneNumber,
        userId: session.user.id,
        orderId: order.id,
        callbackUrl,
        reference: order.orderNumber,
      });

      if (result.providerTxId) {
        await prisma.order.update({
          where: { id: order.id },
          data: { providerTxId: result.providerTxId },
        });
      }

      if (!result.success) {
        return NextResponse.json(
          {
            error: result.error || "Mobile money payment initiation failed",
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod,
        providerTxId: result.providerTxId,
        status: result.status,
      });
    }

    return NextResponse.json(
      { error: "Unsupported payment method" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}
