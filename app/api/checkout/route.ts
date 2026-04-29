import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("freelancerflow");
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: body.priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      metadata: { userId: user._id.toString(), plan: body.plan }, // ✅ must for webhook
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "Checkout failed", details: err.message },
      { status: 500 },
    );
  }
}
