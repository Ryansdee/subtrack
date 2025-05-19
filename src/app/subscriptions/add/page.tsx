"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; // ajuste le chemin si besoin
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // ajuste le chemin si besoin

export default function AddSubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Vous devez être connecté.");

    try {
      await addDoc(collection(db, "users", user.uid, "subscriptions"), {
        name,
        price: parseFloat(price),
        createdAt: serverTimestamp(),
      });

      router.push("/main");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Impossible d'ajouter l'abonnement.");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Ajouter un abonnement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-indigo-700">Nom du service</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block font-medium text-indigo-700">Prix mensuel (€)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Ajouter
        </button>
      </form>
    </main>
  );
}
