"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ComparePage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const { user, getToken } = useAuth();

  const handleCompare = async () => {
    if (!user) return;

    const token = await getToken();
    setLoading(true);
    setResult(null);

    try {
      const body = userPrompt
        ? { prompt: userPrompt }
        : {}; // si pas de prompt, on laisse vide pour demander à l'IA

      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.suggestion);
      } else {
        setResult(data.error || "Erreur lors de la comparaison");
      }
    } catch {
      setResult("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Comparer mes abonnements</h1>
      <textarea
        placeholder="Posez votre propre question ou laissez vide pour une suggestion automatique"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
        rows={4}
      />
      <button
        onClick={handleCompare}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Comparaison en cours..." : userPrompt ? "Envoyer ma question" : "Comparer automatiquement"}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-indigo-100 text-indigo-900 rounded-lg shadow">
          <p className="font-medium">Suggestion :</p>
          <p>{result}</p>
        </div>
      )}
    </main>
  );
}
