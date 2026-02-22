import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order and verify ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (order.paymentStatus === "COMPLETED") {
      return NextResponse.json(
        { error: "This order has already been paid" },
        { status: 400 }
      );
    }

    if (order.paymentMethod !== "CARD") {
      return NextResponse.json(
        { error: "This order does not use card payment" },
        { status: 400 }
      );
    }

    // If a PaymentIntent already exists, retrieve it
    if (order.paymentIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve(
        order.paymentIntentId
      );

      if (
        existingIntent.status === "requires_payment_method" ||
        existingIntent.status === "requires_confirmation" ||
        existingIntent.status === "requires_action"
      ) {
        return NextResponse.json({
          clientSecret: existingIntent.client_secret,
          orderId: order.id,
          orderNumber: order.orderNumber,
        });
      }
    }

    // Create a new PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: order.currency.toLowerCase(),
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: session.user.id,
      },
    });

    // Update the order with the new PaymentIntent ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
