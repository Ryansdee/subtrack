"use client";

import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface AuthContextType {
  name: string;
  updateName: (newName: string) => void;
}

export default function Settings() {
  const { name, updateName } = useAuth() as AuthContextType;
  const [newName, setNewName] = useState(name);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateName(newName);
    alert("Nom mis à jour !");
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Voulez-vous vraiment annuler votre abonnement ?")) return;

    setIsCancelling(true);
    try {
      const res = await fetch("/api/cancel-my-subscription", {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'annulation");
      }

      alert("Votre abonnement a été annulé.");
      // Optionnel : rafraîchir la page, la session ou rediriger
      // window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold" htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Enregistrer
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Abonnement</h2>
        <button
          onClick={handleCancelSubscription}
          disabled={isCancelling}
          className={`bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition ${
            isCancelling ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isCancelling ? "Annulation en cours..." : "Annuler mon abonnement"}
        </button>
      </section>
    </div>
  );
}
