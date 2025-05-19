// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

if (!process.env.MY_API_KEY) {
  throw new Error("MY_API_KEY is not defined");
}


export const POST = async (req: Request) => {
  try {
    const { uid, email } = await req.json();

    if (!email || !uid) {
      return NextResponse.json({ error: "Email or UID is missing." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // ton prix Stripe avec essai
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { uid },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
