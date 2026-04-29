import Stripe from "stripe";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata.userId;

    const client = await clientPromise;
    const db = client.db("freelancerflow");

    // Fetch full subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          plan: "pro",
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          subscription: {
            status: subscription.status,
            current_period_end: subscription.current_period_end,
            interval: subscription.items.data[0].price.recurring.interval, // monthly/yearly
          },
        },
      }
    );

    console.log(`User ${userId} upgraded to Pro successfully.`);
  }

  return NextResponse.json({ received: true });
}