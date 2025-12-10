"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  return (
    <header className="w-full border-b border-subtle surface">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Accueil Purple Dog">
            <img src="/objects/logo.svg" alt="Purple Dog" className="h-9 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="link text-sm">
                  Mon profil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline h-9"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="link text-sm">
                  Se connecter
                </Link>
                <Link href="/signup" className="btn btn-primary h-9">
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
