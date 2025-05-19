"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TrashIcon, PlusCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

interface Subscription {
  id: string;
  name: string;
  price: number;
}

export default function SubscriptionsPage() {
  const { user, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      const fetchSubscriptions = async () => {
        try {
          const subsCol = collection(db, "users", user.uid, "subscriptions");
          const subsSnapshot = await getDocs(subsCol);

          const subsData: Subscription[] = subsSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
          }));

          setSubscriptions(subsData);
          setLoadingSubs(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des abonnements :", error);
          setLoadingSubs(false);
        }
      };

      fetchSubscriptions();
    }
  }, [user, loading]);

  const handleDelete = async (id: string, name: string) => {
    if (!user) return;
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer l'abonnement "${name}" ?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "subscriptions", id));
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'abonnement :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const totalPrice = subscriptions.reduce((acc, sub) => acc + sub.price, 0);

  if (loading || loadingSubs)
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600 font-semibold text-xl">
        Chargement des abonnements...
      </div>
    );
  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-semibold text-xl gap-4">
        <p>Vous devez être connecté pour voir vos abonnements.</p>
        <Link href="/auth/login">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
            Se connecter
          </button>
        </Link>
      </div>
    );

  return (
    <>
      {/* Header sticky avec bouton logout */}

      <main className="max-w-6xl mx-auto px-6 py-10 mb-60">
        <section className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-indigo-900 mb-4">Gérez facilement tous vos abonnements</h2>
          <p className="text-indigo-700 max-w-3xl mx-auto mb-6">
            Ajoutez, modifiez ou supprimez vos abonnements en un seul endroit, et suivez vos dépenses mensuelles.
          </p>
          <p className="text-lg font-semibold text-indigo-900">
            Dépense mensuelle totale :{" "}
            <span className="text-indigo-600">{totalPrice.toFixed(2)} €</span>
          </p>
        </section>

        <div className="flex justify-between items-center mb-8">
          <Link href="/subscriptions/add">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform transform hover:-translate-y-1 flex items-center gap-2">
              <PlusCircleIcon className="w-6 h-6" />
              Ajouter un abonnement
            </button>
          </Link>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-6">
            <img
              src="/empty-subscriptions.svg"
              alt="Aucun abonnement"
              className="mx-auto w-48 opacity-50"
            />
            <p className="text-lg max-w-md">
              Vous n’avez pas encore d’abonnements. Commencez par en ajouter un pour mieux gérer vos dépenses !
            </p>
            <Link href="/subscriptions/add">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow transition">
                Ajouter un abonnement
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.map(({ id, name, price }) => (
              <div
                key={id}
                className="relative bg-white rounded-3xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition cursor-default transform hover:-translate-y-1"
              >
                <h3 className="text-2xl font-semibold text-indigo-900 mb-2 truncate">{name}</h3>
                <p className="text-indigo-700 font-medium mb-4">
                  Prix mensuel : <span className="text-indigo-900">{price} €</span>
                </p>

                <button
                  onClick={() => handleDelete(id, name)}
                  aria-label={`Supprimer l'abonnement ${name}`}
                  className="absolute top-4 right-4 p-2 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                  title="Supprimer cet abonnement"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
