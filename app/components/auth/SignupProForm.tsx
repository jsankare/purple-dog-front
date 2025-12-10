"use client";

import { useState } from "react";
import { registerUser, type Gender } from "@/lib/api/auth";

export default function SignupProForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "other" as Gender,
    email: "",
    companyName: "",
    siret: "",
    address: "",
    password: "",
    website: "",
    specialties: "",
    wantedObjects: "",
    socialLinks: "",
    cgvAccepted: false,
    mandateAccepted: false,
    newsletter: false,
    rgpdAccepted: false,
    officialDoc: null as File | null,
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

    if (!form.rgpdAccepted || !form.cgvAccepted || !form.mandateAccepted) {
      return setErr("Veuillez accepter RGPD, CGV et le mandat.");
    }

    setLoading(true);
    try {
      // Inscription de base (infos pro complétées plus tard)
      await registerUser({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
      });

      setOk("Compte pro créé. Les informations professionnelles seront complétées ultérieurement.");
      setForm({
        firstName: "",
        lastName: "",
        gender: "other",
        email: "",
        companyName: "",
        siret: "",
        address: "",
        password: "",
        website: "",
        specialties: "",
        wantedObjects: "",
        socialLinks: "",
        cgvAccepted: false,
        mandateAccepted: false,
        newsletter: false,
        rgpdAccepted: false,
        officialDoc: null,
      });
    } catch (e: any) {
      setErr(e?.message ?? "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Identité */}
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

      {/* Coordonnées de connexion */}
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      {/* Informations professionnelles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Raison sociale</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="input w-full"
            placeholder="Nom de l’entreprise"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">SIRET</label>
          <input
            type="text"
            value={form.siret}
            onChange={(e) => update("siret", e.target.value)}
            className="input w-full"
            placeholder="123 456 789 00012"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Adresse professionnelle</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="input w-full"
          placeholder="Adresse complète"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Site web</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className="input w-full"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Réseaux sociaux</label>
          <input
            type="text"
            value={form.socialLinks}
            onChange={(e) => update("socialLinks", e.target.value)}
            className="input w-full"
            placeholder="Instagram, LinkedIn, etc."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Spécialités</label>
          <input
            type="text"
            value={form.specialties}
            onChange={(e) => update("specialties", e.target.value)}
            className="input w-full"
            placeholder="Montres, bijoux, art, ..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Objets recherchés</label>
          <input
            type="text"
            value={form.wantedObjects}
            onChange={(e) => update("wantedObjects", e.target.value)}
            className="input w-full"
            placeholder="Marques, périodes, styles..."
          />
        </div>
      </div>

      {/* Pièce officielle */}
      <div>
        <label className="mb-1 block text-sm font-medium">Document officiel (Kbis, pièce d’identité, etc.)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => update("officialDoc", e.currentTarget.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-(--surface-2) file:px-3 file:py-2 file:text-sm file:text-(--text)"
        />
        {form.officialDoc && (
          <p className="mt-1 text-xs text-muted">
            Fichier sélectionné: {form.officialDoc.name}
          </p>
        )}
      </div>

      {/* Consentements */}
      <div className="space-y-3">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.cgvAccepted}
            onChange={(e) => update("cgvAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4"
            required
          />
          <span>
            J’accepte les CGV.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.mandateAccepted}
            onChange={(e) => update("mandateAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4"
            required
          />
          <span>
            J’accepte le mandat (mandat de vente/mandat de courtage).
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.rgpdAccepted}
            onChange={(e) => update("rgpdAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4"
            required
          />
          <span>
            J’accepte la politique RGPD.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => update("newsletter", e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>Recevoir la newsletter (optionnel)</span>
        </label>
      </div>

      {err && (
        <div className="rounded-app border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}
      {ok && (
        <div className="rounded-app border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {ok}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Création du compte..." : "Créer mon compte pro"}
      </button>

      <p className="mt-2 text-xs text-muted">
        Pas de CB requise. Les informations professionnelles détaillées pourront être complétées après activation.
      </p>
    </form>
  );
}