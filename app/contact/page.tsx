"use client";
import { useState } from "react";

//export const metadata = { title: "Contact – Purple Dog" };

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    if (!form.consent) {
      setErr("Veuillez accepter le traitement de vos données pour nous contacter.");
      return;
    }
    setLoading(true);
    try {
      // TODO: POST /api/contact
      await new Promise((r) => setTimeout(r, 800));
      setOk("Merci pour votre message. Nous revenons vers vous rapidement.");
      setForm({ name: "", email: "", subject: "", message: "", consent: false });
    } catch (e: any) {
      setErr(e?.message ?? "Erreur lors de l’envoi du message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <h1 className="h1">Contact</h1>
        <p className="mt-2 text-muted">Une question, un partenariat, un retour ? Écrivez-nous.</p>

        <form onSubmit={onSubmit} className="mt-8 card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Nom</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Sujet</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="input w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="input w-full"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1 h-4 w-4"
              required
            />
            <label htmlFor="consent" className="text-sm">
              J’accepte que mes données soient utilisées pour traiter ma demande de contact.
            </label>
          </div>

          {err && <div className="rounded-app border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
          {ok && <div className="rounded-app border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </main>
  );
}