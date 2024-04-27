import { stripe } from "@/libs/stripe";
import { manageSubscriptionStatusChange, upsertPriceRecord, upsertProductRecord } from "@/libs/stripe/admin-task";
import { CustomException } from "@/libs/utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) throw new CustomException("Invalid signature!", 403);

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.log("Webhook Error:", error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: error?.status ?? 500 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;

        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;

          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );

          console.log("FROM WEBHOOK🚀", subscription.status);

          break;

        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true);
          }

          break;

        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error: any) {
      console.log("Webhook Handler Error:", error.message);
      return NextResponse.json({ error: `Webhook handler error: ${error.message}` }, { status: error?.status ?? 500 });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
