import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          console.error("No orderId in PaymentIntent metadata:", paymentIntent.id);
          break;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "COMPLETED",
            status: "PROCESSING",
            paymentIntentId: paymentIntent.id,
            providerTxId: paymentIntent.id,
          },
        });

        console.log(
          `Order ${orderId} payment succeeded. PaymentIntent: ${paymentIntent.id}`
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          console.error("No orderId in PaymentIntent metadata:", paymentIntent.id);
          break;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
          },
        });

        console.log(
          `Order ${orderId} payment failed. PaymentIntent: ${paymentIntent.id}. Reason: ${
            paymentIntent.last_payment_error?.message || "Unknown"
          }`
        );
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
