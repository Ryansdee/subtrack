// src/app/checkout/processing/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutProcessing() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) return;

      const res = await fetch("/api/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        router.push("/profile");
      }
    };

    verifySubscription();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex justify-center items-center text-lg">
      Vérification de votre abonnement...
    </div>
  );
}
