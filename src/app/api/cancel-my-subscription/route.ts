import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const POST = async (req: Request) => {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
    }

    // Supprimer l'abonnement Stripe
    await stripe.subscriptions.cancel(subscriptionId);

    // Ici, tu peux aussi mettre à jour ta base (Firestore, etc.) si besoin

    return NextResponse.json({ message: "Abonnement annulé avec succès" });
  } catch (error: any) {
    console.error("Erreur lors de l'annulation:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'annulation" }, { status: 500 });
  }
};
