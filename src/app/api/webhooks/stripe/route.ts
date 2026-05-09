import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { creditBalance, isTransactionProcessed } from "@/lib/payments";

/**
 * POST /api/webhooks/stripe — Handle Stripe webhook events.
 * Verifies the Stripe signature, processes checkout.session.completed,
 * and credits the user's balance.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // Process events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const amountStr = session.metadata?.amount;
      const sessionId = session.id;

      if (!userId || !amountStr) {
        console.error("Missing metadata in Stripe session:", sessionId);
        return NextResponse.json({ received: true });
      }

      // Idempotency check
      const alreadyProcessed = await isTransactionProcessed(sessionId);
      if (alreadyProcessed) {
        console.log("Stripe session already processed:", sessionId);
        return NextResponse.json({ received: true });
      }

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.error("Invalid amount in Stripe session:", amountStr);
        return NextResponse.json({ received: true });
      }

      try {
        await creditBalance(
          userId,
          amount,
          `Stripe deposit — $${amount.toFixed(2)}`,
          {
            externalId: sessionId,
            provider: "stripe",
            paymentIntent: session.payment_intent,
            customerEmail: session.customer_details?.email,
          }
        );
        console.log(
          `Credited $${amount.toFixed(2)} to user ${userId} via Stripe session ${sessionId}`
        );
      } catch (err) {
        console.error("Failed to credit balance:", err);
        return NextResponse.json(
          { error: "Failed to credit balance" },
          { status: 500 }
        );
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.warn(
        `Payment failed for intent ${intent.id}:`,
        intent.last_payment_error?.message
      );
      break;
    }

    default:
      // Unhandled event type — acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true });
}
