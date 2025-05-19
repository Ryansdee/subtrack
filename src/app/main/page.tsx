"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Subscription {
  id: string;
  name: string;
  price: number;
}

export default function MainPage() {
  const { user, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [imageErrorIds, setImageErrorIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && user) {
      const fetchSubscriptions = async () => {
        try {
          const subsCol = collection(db, "users", user.uid, "subscriptions");
          const subsSnapshot = await getDocs(subsCol);

          const subsData: Subscription[] = subsSnapshot.docs.map((doc) => ({
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

  if (loading || loadingSubs)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-indigo-600 text-lg font-semibold animate-pulse">Chargement...</p>
      </main>
    );
  if (!user) return null;

  const totalPrice = subscriptions.reduce((acc, sub) => acc + sub.price, 0);

  const handleImageError = (id: string) => {
    setImageErrorIds((prev) => new Set(prev).add(id));
  };

  function nameToDomain(name: string) {
  return name.toLowerCase().replace(/\s+/g, "") + ".com";
}

  return (
    <>
      <Head>
        <title>Mes abonnements actifs</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Mes abonnements actifs</h1>

          {subscriptions.length === 0 ? (
            <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-md text-center">
              <p className="text-gray-700 text-lg mb-6">Vous n'avez encore ajouté aucun abonnement.</p>
              <Link
                href="/subscriptions/add"
                aria-label="Ajouter un abonnement"
                className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Ajouter un abonnement
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {subscriptions.map(({ id, name, price }) => {
                const domain = nameToDomain(name);
                const imageUrl = `https://logo.clearbit.com/${domain}`;
                const hasImageError = imageErrorIds.has(id);

                return (
                    <div key={id} className="flex items-center space-x-4 bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    {!hasImageError ? (
                        <img
                        src={imageUrl}
                        alt={`${name} logo`}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-contain"
                        onError={() => handleImageError(id)}
                        loading="lazy"
                        />
                    ) : (
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {name.charAt(0)}
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-semibold text-indigo-900">{name}</h2>
                        <p className="text-gray-700">
                        Prix mensuel : <span className="font-medium">{price.toFixed(2)} €</span>
                        </p>
                    </div>
                    </div>
                );
                })}

              </div>

              <div className="mb-10 text-right text-xl font-semibold text-indigo-700">
                Total mensuel : {totalPrice.toFixed(2)} €
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              href="/subscriptions"
              aria-label="Gérer mes abonnements"
              className="text-center bg-white border border-indigo-600 text-indigo-600 font-semibold px-6 py-4 rounded-lg hover:bg-indigo-50 transition"
            >
              Gérer mes abonnements
            </Link>
            <Link
              href="/compare"
              aria-label="Comparer mes abonnements"
              className="text-center bg-indigo-600 text-white font-semibold px-6 py-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Comparer mes abonnements
            </Link>
            <Link
              href="/subscriptions/add"
              aria-label="Ajouter un abonnement"
              className="text-center bg-white border border-indigo-600 text-indigo-600 font-semibold px-6 py-4 rounded-lg hover:bg-indigo-50 transition"
            >
              Ajouter un abonnement
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
