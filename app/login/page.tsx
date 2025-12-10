// app/signup/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // TODO: call API signup
      // await signup(...)
      window.location.href = "/";
    } catch (e: any) {
      setErr(e?.message ?? "Erreur d’inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="h1">Créer un compte</h1>
          <p className="text-sm text-muted">Rejoignez Purple Dog pour vendre et suivre vos objets de valeur.</p>
          <p className="mt-1 text-sm">
            Déjà un compte ? <Link href="/login" className="link">Se connecter</Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input className="input w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nom@exemple.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input className="input w-full" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required placeholder="••••••••" />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
            <span>J’accepte les <Link href="/mentions-legales" className="link">conditions</Link> et la <Link href="/privacy" className="link">politique de confidentialité</Link>.</span>
          </label>

          {err && <div className="rounded-app border border-red-200 bg-red-50 px-3 py-2 text-sm" style={{ color: "#7f1d1d" }}>{err}</div>}

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>
      </div>
    </main>
  );
}