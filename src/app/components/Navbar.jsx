"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation"; // Ajoute cette ligne en haut


export default function Navbar() {
  const router = useRouter(); // Initialise le routeur
  const { user, name, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/auth/login"); // Redirige correctement côté client
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href={user ? "/main" : "/"} className="text-2xl font-bold tracking-wide">
          Subtrack
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
          <Link href="/main" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Accueil</Link>
              <Link href="/profile" className="hover:text-gray-300 transition">{name}</Link>
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
          <Link href="/" className="hover:text-gray-300 transition">Accueil</Link>
              <Link href="/auth/login" className="hover:text-gray-300 transition">Connexion</Link>
              <Link href="/auth/register" className="hover:text-gray-300 transition">Inscription</Link>
            </>
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 px-4 pb-4 border-t border-gray-700">
          {user ? (
            <>
            <Link href="/main" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Accueil</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">
                {name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 w-full text-left px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">Accueil</Link>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">
                Connexion
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="hover:text-gray-300 transition">
                Inscription
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
