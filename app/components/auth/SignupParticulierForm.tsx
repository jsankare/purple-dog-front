"use client";

import { useState } from "react";

export default function SignupParticulierForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    avatar: null as File | null,
    email: "",
    address: "",
    password: "",
    ageCertified: false,
    newsletter: false,
    rgpdAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!form.ageCertified) {
      setErr("Vous devez certifier avoir plus de 18 ans.");
      return;
    }
    if (!form.rgpdAccepted) {
      setErr("Vous devez accepter la politique RGPD.");
      return;
    }

    setLoading(true);
    try {
      // Préparation payload (mock). L’avatar peut être envoyé via FormData plus tard.
      const payload = {
        type: "particulier",
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        address: form.address,
        password: form.password,
        newsletter: form.newsletter,
        rgpdAccepted: form.rgpdAccepted,
        ageCertified: form.ageCertified,
        publicNamePolicy: "firstName_only", // seul le prénom visible
      };

      // TODO: POST /auth/signup
      await new Promise((r) => setTimeout(r, 800));

      // TODO: déclencher l’envoi d’email de validation côté backend
      setOk("Compte créé. Un e-mail de validation vous a été envoyé.");
      setForm({
        firstName: "",
        lastName: "",
        avatar: null,
        email: "",
        address: "",
        password: "",
        ageCertified: false,
        newsletter: false,
        rgpdAccepted: false,
      });
    } catch (e: any) {
      setErr(e?.message ?? "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Prénom</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nom</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Photo de profil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => update("avatar", e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Adresse postale</label>
        <input
          type="text"
          required
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="N°, Rue, Code postal, Ville, Pays"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Au moins 8 caractères"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="age"
          type="checkbox"
          checked={form.ageCertified}
          onChange={(e) => update("ageCertified", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="age" className="text-sm">
          Je certifie avoir plus de 18 ans
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="newsletter"
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => update("newsletter", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="newsletter" className="text-sm">Inscription à la Newsletter</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rgpd"
          type="checkbox"
          checked={form.rgpdAccepted}
          onChange={(e) => update("rgpdAccepted", e.target.checked)}
          className="h-4 w-4"
          required
        />
        <label htmlFor="rgpd" className="text-sm">
          J’accepte la politique RGPD
        </label>
      </div>

      <p className="text-sm text-gray-600">
        Confidentialité: Les professionnels ne pourront pas connaître votre identité. Seul votre prénom sera visible.
      </p>

      {err && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {ok && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Création du compte..." : "Créer mon compte"}
      </button>
    </form>
  );
}