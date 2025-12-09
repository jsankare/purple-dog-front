"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // TODO: call backend /auth/login
      await new Promise((r) => setTimeout(r, 800));
      // TODO: redirect après login
      alert("Connexion réussie (mock)");
    } catch (e: any) {
      setErr(e?.message ?? "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold">Se connecter</h1>
        <p className="mt-2 text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium underline">
            S’inscrire
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mot de passe</label>
            <div className="flex rounded-md border focus-within:ring-2 focus-within:ring-gray-300">
              <input
                type={showPwd ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-l-md px-3 py-2 text-sm outline-none"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="rounded-r-md border-l px-3 text-sm text-gray-600 hover:bg-gray-50"
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwd ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          {err && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="#" className="text-gray-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}