"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Subscription {
  id: string;
  name: string;
  price: number;
}

export default function Dashboard() {
  const { user, loading, name } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

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

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">Bienvenue 👋</h1>
          <p className="text-gray-700 text-lg">
            Connecté en tant que{" "}
            <span className="font-medium text-indigo-700">{name}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Section Informations Utilisateur */}
          <div className="bg-indigo-50 rounded-xl p-6 shadow-inner">
            <h2 className="text-xl font-bold text-indigo-900 mb-3">Mes Informations</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Email :</strong> {user.email}</li>
              <li><strong>UID :</strong> {user.uid}</li>
            </ul>
          </div>

          {/* Accès aux paramètres */}
          <div className="bg-indigo-50 rounded-xl p-6 shadow-inner flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-indigo-900 mb-3">Paramètres</h2>
              <p className="text-gray-700 mb-4">Gérez votre compte, notifications et préférences.</p>
            </div>
            <Link href="/settings">
              <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded hover:bg-indigo-700 transition w-full">
                Aller aux paramètres
              </button>
            </Link>
          </div>
        </div>

        {/* Abonnements utilisateur */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Mes abonnements</h2>
          {loadingSubs ? (
            <p className="text-gray-600 italic">Chargement des abonnements...</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-gray-600 italic">Vous n'avez pas encore d'abonnements.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {subscriptions.map(({ id, name, price }) => (
                <li key={id}>
                  {name} — {price} €
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
