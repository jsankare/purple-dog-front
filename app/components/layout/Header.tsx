"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-subtle surface">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Accueil Purple Dog">
            <img src="/objects/logo.svg" alt="Purple Dog" className="h-9 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="link text-sm">
              Se connecter
            </Link>
            <Link href="/signup" className="btn btn-primary h-9">
              S’inscrire
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}