"use client";

import { useState } from "react";

export default function SignupProForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    siret: "",
    officialDoc: null as File | null,
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

    if (!form.cgvAccepted || !form.mandateAccepted) {
      setErr("Vous devez accepter les CGV et le mandat d’apport d’affaire.");
      return;
    }
    if (!form.specialties.trim() || !form.wantedObjects.trim()) {
      setErr("Veuillez renseigner vos spécialités et les objets recherchés (obligatoires).");
      return;
    }
    if (!form.rgpdAccepted) {
      setErr("Vous devez accepter la politique RGPD.");
      return;
    }

    setLoading(true);
    try {
      // Préparation FormData pour inclure le document officiel
      const fd = new FormData();
      fd.append("type", "professionnel");
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("email", form.email);
      fd.append("companyName", form.companyName);
      fd.append("siret", form.siret);
      if (form.officialDoc) fd.append("officialDoc", form.officialDoc);
      fd.append("address", form.address);
      fd.append("password", form.password);
      fd.append("website", form.website);
      fd.append("specialties", form.specialties);
      fd.append("wantedObjects", form.wantedObjects);
      fd.append("socialLinks", form.socialLinks);
      fd.append("newsletter", String(form.newsletter));
      fd.append("rgpdAccepted", String(form.rgpdAccepted));
      fd.append("cgvAccepted", String(form.cgvAccepted));
      fd.append("mandateAccepted", String(form.mandateAccepted));

      // TODO: POST /auth/signup-pro
      await new Promise((r) => setTimeout(r, 1000));

      // TODO: déclencher e-mail de validation côté backend
      setOk("Compte pro créé. Un e-mail de validation vous a été envoyé.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        siret: "",
        officialDoc: null,
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
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Dénomination de l’entreprise</label>
          <input
            type="text"
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Numéro SIRET</label>
          <input
            type="text"
            required
            value={form.siret}
            onChange={(e) => update("siret", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="14 chiffres"
            inputMode="numeric"
            pattern="[0-9]{14}"
            title="14 chiffres"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Document officiel (K‑Bis, INSEE, etc.)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => update("officialDoc", e.target.files?.[0] ?? null)}
          className="w-full text-sm"
          required
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
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Site internet (optionnel)</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Réseaux sociaux (optionnel)</label>
          <input
            type="text"
            value={form.socialLinks}
            onChange={(e) => update("socialLinks", e.target.value)}
            placeholder="@instagram, linkedin url..."
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Spécialités (obligatoire)</label>
        <input
          type="text"
          required
          value={form.specialties}
          onChange={(e) => update("specialties", e.target.value)}
          placeholder="Ex: art moderne, montres, bijoux..."
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Objets recherchés (obligatoire)</label>
        <input
          type="text"
          required
          value={form.wantedObjects}
          onChange={(e) => update("wantedObjects", e.target.value)}
          placeholder="Ex: Rolex, Patek, sacs Hermès..."
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
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
        <label htmlFor="rgpd" className="text-sm">J’accepte la politique RGPD</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="cgv"
          type="checkbox"
          checked={form.cgvAccepted}
          onChange={(e) => update("cgvAccepted", e.target.checked)}
          className="h-4 w-4"
          required
        />
        <label htmlFor="cgv" className="text-sm">
          J’accepte les CGV
        </label>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="mandate"
          type="checkbox"
          checked={form.mandateAccepted}
          onChange={(e) => update("mandateAccepted", e.target.checked)}
          className="mt-1 h-4 w-4"
          required
        />
        <label htmlFor="mandate" className="text-sm">
          J’accepte le mandat d’apport d’affaire
        </label>
      </div>

      {err && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {ok && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{ok}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Création du compte..." : "Créer mon compte pro"}
      </button>

      <p className="mt-2 text-xs text-gray-600">
        Pas de carte bancaire requise pour s’inscrire.
      </p>
    </form>
  );
}