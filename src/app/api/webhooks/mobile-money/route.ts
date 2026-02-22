import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllAdapters } from "@/lib/payments/mobile-money/adapter";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const adapters = getAllAdapters();

    let callbackResult = null;
    let matchedProvider = "";

    // Try each enabled adapter to verify the callback
    for (const { provider, adapter } of adapters) {
      try {
        const result = await adapter.verifyCallback(payload);
        if (result.verified) {
          callbackResult = result;
          matchedProvider = provider;
          break;
        }
      } catch {
        // This adapter didn't match - try the next one
        continue;
      }
    }

    if (!callbackResult) {
      console.error("No adapter could verify mobile money callback:", payload);
      return NextResponse.json(
        { error: "Unable to verify callback" },
        { status: 400 }
      );
    }

    console.log(
      `Mobile money callback verified by ${matchedProvider}:`,
      callbackResult
    );

    // Find the order by providerTxId or reference (orderNumber)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { providerTxId: callbackResult.providerTxId },
          { orderNumber: callbackResult.reference },
        ],
      },
    });

    if (!order) {
      console.error(
        "Order not found for mobile money callback:",
        callbackResult
      );
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Don't update already completed orders
    if (order.paymentStatus === "COMPLETED") {
      return NextResponse.json({ received: true, status: "already_completed" });
    }

    if (callbackResult.status === "COMPLETED") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "COMPLETED",
          status: "PROCESSING",
          providerTxId: callbackResult.providerTxId,
        },
      });

      console.log(
        `Order ${order.id} payment completed via ${matchedProvider}. TX: ${callbackResult.providerTxId}`
      );
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
      });

      console.log(
        `Order ${order.id} payment failed via ${matchedProvider}. TX: ${callbackResult.providerTxId}`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mobile money webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
