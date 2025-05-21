"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

type SubscriptionExample = {
  name: string;
  domain: string; // utilisé pour récupérer logo via API
};

// Fonction pour récupérer logo Clearbit via domaine
const getLogoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

export default function LandingPage() {
  const [examples, setExamples] = useState<SubscriptionExample[]>([]);

  // Simuler fetch abonnements exemples (pour montrer sur landing)
  useEffect(() => {
    setExamples([
      { name: "Netflix", domain: "netflix.com" },
      { name: "Spotify", domain: "spotify.com" },
      { name: "Adobe Creative Cloud", domain: "adobe.com" },
      { name: "Amazon Prime", domain: "primevideo.com" },
      { name: "Dropbox", domain: "dropbox.com" },
    ]);
  }, []);

  // Exemple de suggestion IA (statique, pour la démo)
  const exampleSuggestion = `Vous pouvez annuler Adobe Creative Cloud car vous ne l'utilisez plus souvent, cela vous fera économiser 20€/mois.`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-indigo-900">
      {/* Section Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-sm">
            Gérez vos abonnements en toute simplicité
          </h1>
          <p className="text-indigo-700 text-lg mb-8">
            SubTrack vous aide à suivre tous vos abonnements, vous prévient avant les prélèvements, vous guide pour les annuler facilement, et vous propose même des conseils personnalisés grâce à l’intelligence artificielle.
          </p>
          <div className="flex justify-center md:justify-start gap-6 mb-8">
            <Link href="/auth/register">
              <button className="rounded-full bg-indigo-600 text-white font-semibold px-8 py-4 shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1">
                Créer un compte
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="rounded-full border-2 border-indigo-600 text-indigo-600 font-semibold px-8 py-4 hover:bg-indigo-100 transition">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full max-w-lg">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2542/2542445.png"
            alt="Illustration tableau de bord"
            className="w-full object-contain"
          />
        </div>
      </section>

      {/* Exemples d'abonnements avec logos */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">
          Exemples d’abonnements que vous pouvez gérer
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {examples.map(({ name, domain }) => (
            <div key={name} className="flex flex-col items-center gap-3 w-28">
              <img
                src={getLogoUrl(domain)}
                alt={`${name} logo`}
                className="w-20 h-20 object-contain rounded-full shadow"
                onError={(e) => {
                  // Fallback logo si l'API Clearbit échoue
                  (e.currentTarget as HTMLImageElement).src = "/fallback-logo.png";
                }}
              />
              <span className="text-indigo-700 font-semibold text-center">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mini démo suggestion IA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-10">
          Exemple de suggestion intelligente
        </h2>
        <div className="max-w-3xl mx-auto bg-indigo-100 text-indigo-900 rounded-xl p-8 shadow-lg text-center font-medium text-lg">
          {exampleSuggestion}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Pourquoi choisir SubTrack ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            {
              icon: <CheckCircleIcon className="w-16 h-16 text-indigo-600 mx-auto mb-6" />,
              title: "Suivi automatique & précis",
              desc: "Recevez des alertes avant chaque prélèvement pour ne jamais être pris au dépourvu.",
            },
            {
              icon: <ArrowPathIcon className="w-16 h-16 text-indigo-600 mx-auto mb-6" />,
              title: "Annulation simplifiée",
              desc: "Nous vous guidons étape par étape pour annuler vos abonnements sans tracas.",
            },
            {
              icon: <ShieldCheckIcon className="w-16 h-16 text-indigo-600 mx-auto mb-6" />,
              title: "Sécurité et confidentialité",
              desc: "Vos données sont protégées avec les meilleures pratiques de sécurité.",
            },
            {
              icon: <ChatBubbleLeftEllipsisIcon className="w-16 h-16 text-indigo-600 mx-auto mb-6" />,
              title: "Suggestions par IA",
              desc: "Posez vos questions ou laissez l’IA analyser vos abonnements pour vous conseiller intelligemment.",
            },
          ].map(({ icon, title, desc }) => (
            <article
              key={title}
              className="bg-white rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition"
            >
              {icon}
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-indigo-700">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-indigo-600 text-white px-6 py-20 rounded-3xl max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14">
          Ce que nos utilisateurs disent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              name: "Alice Dupont",
              feedback: "Grâce à SubTrack, je ne rate plus aucun prélèvement et j’ai économisé sur des abonnements oubliés.",
            },
            {
              name: "Marc Lefèvre",
              feedback: "L’interface est intuitive et les notifications arrivent toujours à temps. Je recommande !",
            },
            {
              name: "Sophie Martin",
              feedback: "Enfin un outil simple pour gérer tous mes abonnements sans stress.",
            },
          ].map(({ name, feedback }) => (
            <blockquote
              key={name}
              className="bg-indigo-700 rounded-2xl p-8 shadow-lg"
            >
              <p className="italic mb-6">“{feedback}”</p>
              <footer className="font-semibold text-right">— {name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Prêt à reprendre le contrôle de vos abonnements ?
        </h2>
        <Link href="/auth/register">
          <button className="mt-4 rounded-full bg-indigo-600 text-white font-semibold px-12 py-5 shadow-lg hover:bg-indigo-700 transition-transform transform hover:-translate-y-1">
            Créer mon compte gratuitement
          </button>
        </Link>
      </section>
    </main>
  );
}
