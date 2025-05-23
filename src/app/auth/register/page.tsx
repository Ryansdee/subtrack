"use client";
import { useState, Suspense } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, createUserInFirestore } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name });
        await createUserInFirestore(user.uid, user.email || "", "member");

        // Redirection directe vers /main
        router.push("/main");

        /*
        // Ancienne logique Stripe Checkout
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        });

        const { url } = await response.json();

        if (url) {
          window.location.href = url;
        } else {
          router.push("/profile");
        }
        */
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await createUserInFirestore(user.uid, user.email || "", "member");

        // Redirection directe vers /main
        router.push("/main");

        /*
        // Ancienne logique Stripe Checkout
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        });

        const { url } = await response.json();

        if (url) {
          window.location.href = url;
        } else {
          router.push("/profile");
        }
        */
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Inscription</h1>

      <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
      <input
        type="text"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
      <input
        type="password"
        className="mb-4 w-full p-2 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition mb-4"
      >
        S'inscrire
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        S'inscrire avec Google
      </button>
      {errorParam === "abonnement" && (
        <p className="text-red-500">Vous devez souscrire à un abonnement pour continuer.</p>
      )}
    </form>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
