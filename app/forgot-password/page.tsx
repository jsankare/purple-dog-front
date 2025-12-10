// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { forgotPassword } from "../../lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setOk("Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.");
      setEmail("");
    } catch {
      setOk("Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre e-mail. Vous recevrez un lien pour réinitialiser votre mot de passe.
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
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)"
              placeholder="votre@email.com"
            />
          </div>

          {err && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}
          {ok && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {ok}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-(--brand) px-4 py-2 text-sm font-medium text-white hover:bg-(--brand-600) disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </main>
  );
}