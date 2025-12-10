"use client";

import { useState } from "react";
import { registerUser, type Gender } from "@/lib/api/auth";

export default function SignupParticulierForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "other" as Gender,
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
    if (!form.ageCertified) return setErr("Vous devez certifier avoir plus de 18 ans.");
    if (!form.rgpdAccepted) return setErr("Vous devez accepter la politique RGPD.");
    setLoading(true);
    try {
      await registerUser({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
      });
      setOk("Compte créé. Si la vérification email est activée, un e-mail vous a été envoyé.");
      setForm({
        firstName: "",
        lastName: "",
        gender: "other",
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
            className="input w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nom</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Genre</label>
        <div className="flex gap-4 text-sm">
          {(["male", "female", "other"] as Gender[]).map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={form.gender === g}
                onChange={(e) => update("gender", e.target.value as Gender)}
              />
              <span>{g === "male" ? "Homme" : g === "female" ? "Femme" : "Autre"}</span>
            </label>
          ))}
        </div>
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

      <div>
        <label className="mb-1 block text-sm font-medium">Adresse postale (non stockée pour l’instant)</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="input w-full"
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
          className="input w-full"
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
        <label htmlFor="age" className="text-sm">Je certifie avoir plus de 18 ans</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="newsletter"
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => update("newsletter", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="newsletter" className="text-sm">Inscription à la Newsletter (non stockée pour l’instant)</label>
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
        <label htmlFor="rgpd" className="text-sm">J’accepte la politique RGPD</label>
      </div>

      {err && <div className="rounded-app border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {ok && <div className="rounded-app border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div>}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Création du compte..." : "Créer mon compte"}
      </button>
    </form>
  );
}