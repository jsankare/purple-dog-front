"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-(--border) bg-white">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/objects/logo.jpg" alt="Purple Dog" className="h-6 w-6" />
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-800 hover:underline">
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-(--brand) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--brand-600)"
            >
              S’inscrire
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}