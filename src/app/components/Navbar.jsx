"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, name, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Subtrack
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/main">Accueil</Link>
              <Link href="/profile">{name}</Link>
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/">Accueil</Link>
              <Link href="/auth/login">Connexion</Link>
              <Link href="/auth/register">Inscription</Link>
            </>
          )}
        </div>

        {/* Hamburger icon */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 px-4">
          {user ? (
            <>
              <Link href="/main" onClick={() => setMenuOpen(false)}>Accueil &nbsp;</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>{name}</Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 w-full text-left px-3 py-2 rounded hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)}>Accueill</Link>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>Inscription</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
