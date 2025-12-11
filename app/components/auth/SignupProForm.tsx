"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Mail, Lock, User, MapPin, Home, Building2, FileText, Globe, ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function SignupProForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    companyName: "",
    siret: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    website: "",
    cgvAccepted: false,
    mandateAccepted: false,
    newsletter: false,
    rgpdAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [officialDoc, setOfficialDoc] = useState<File | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function nextStep() {
    setErr(null);
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.password || !form.passwordConfirm) {
        return setErr("Veuillez remplir tous les champs obligatoires");
      }
      if (form.password !== form.passwordConfirm) {
        return setErr("Les mots de passe ne correspondent pas");
      }
      if (form.password.length < 8) {
        return setErr("Le mot de passe doit contenir au moins 8 caractères");
      }
    } else if (step === 2) {
      if (!form.companyName || !form.siret || !form.street || !form.city || !form.postalCode) {
        return setErr("Veuillez remplir tous les champs professionnels obligatoires");
      }
    }
    setStep(step + 1);
  }

  function prevStep() {
    setErr(null);
    setStep(step - 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.cgvAccepted) {
      return setErr("Vous devez accepter les CGV.");
    }
    if (!form.mandateAccepted) {
      return setErr("Vous devez accepter le mandat.");
    }
    if (!form.rgpdAccepted) {
      return setErr("Vous devez accepter la politique RGPD.");
    }
    if (!officialDoc) {
      return setErr("Veuillez ajouter un document officiel (K-Bis, INSEE, etc.)");
    }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const formData = new FormData();
      formData.append('file', officialDoc);

      const uploadResponse = await fetch(`${API_URL}/api/media`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors de l\'upload du document');
      }

      const uploadData = await uploadResponse.json();
      const documentId = uploadData.doc.id;

      await authAPI.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: "professionnel",
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        companyName: form.companyName,
        siret: form.siret,
        officialDocument: documentId,
        website: form.website || undefined,
        acceptedTerms: form.cgvAccepted,
        acceptedMandate: form.mandateAccepted,
        acceptedGDPR: form.rgpdAccepted,
        newsletterSubscription: form.newsletter,
      });

      window.dispatchEvent(new Event('auth-change'));
      router.push('/profile');
    } catch (e: any) {
      setErr(e?.message ?? "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`w-10 h-10 flex items-center justify-center font-medium border-2 transition-colors ${step >= 1 ? 'border-[#4B2377] bg-[#4B2377] text-white' : 'border-neutral-300 text-neutral-500'}`}>
          1
        </div>
        <div className={`h-px w-16 transition-colors ${step >= 2 ? 'bg-[#4B2377]' : 'bg-neutral-300'}`}></div>
        <div className={`w-10 h-10 flex items-center justify-center font-medium border-2 transition-colors ${step >= 2 ? 'border-[#4B2377] bg-[#4B2377] text-white' : 'border-neutral-300 text-neutral-500'}`}>
          2
        </div>
        <div className={`h-px w-16 transition-colors ${step >= 3 ? 'bg-[#4B2377]' : 'bg-neutral-300'}`}></div>
        <div className={`w-10 h-10 flex items-center justify-center font-medium border-2 transition-colors ${step >= 3 ? 'border-[#4B2377] bg-[#4B2377] text-white' : 'border-neutral-300 text-neutral-500'}`}>
          3
        </div>
      </div>

      {err && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                E-mail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="contact@entreprise.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Minimum 8 caractères</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirmer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password"
                    minLength={8}
                    value={form.passwordConfirm}
                    onChange={(e) => update("passwordConfirm", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center justify-center gap-2 py-3 px-6"
            >
              <span>Continuer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Informations professionnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Raison sociale <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="Entreprise SARL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  SIRET <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.siret}
                    onChange={(e) => update("siret", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="12345678900012"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">14 chiffres</p>
              </div>
            </div>

            {/* Ajout du champ document officiel */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Document officiel (K-Bis, avis de situation INSEE, etc.) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setOfficialDoc(e.target.files[0]);
                  }
                }}
                className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                required
              />
              {officialDoc && (
                <div className="mt-2 text-sm text-neutral-700">
                  Fichier sélectionné : {officialDoc.name}
                </div>
              )}
              <p className="text-xs text-neutral-500 mt-1">Formats acceptés : PDF, JPG, PNG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse professionnelle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => update("street", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="123 Avenue des Champs-Élysées"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Code postal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="75008"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ville <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                    placeholder="Paris"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Site web
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="https://www.monentreprise.com"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors py-3 px-6 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors py-3 px-6 flex items-center justify-center gap-2"
              >
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Conditions */}
        {step === 3 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Conditions</h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.cgvAccepted}
                  onChange={(e) => update("cgvAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]"
                />
                <span className="text-sm text-neutral-700">
                  J'accepte les CGV <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mandateAccepted}
                  onChange={(e) => update("mandateAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]"
                />
                <span className="text-sm text-neutral-700">
                  J'accepte le mandat d'apport d'affaire <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rgpdAccepted}
                  onChange={(e) => update("rgpdAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]"
                />
                <span className="text-sm text-neutral-700">
                  J'accepte la politique RGPD <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={(e) => update("newsletter", e.target.checked)}
                  className="mt-0.5 w-5 h-5 border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]"
                />
                <span className="text-sm text-neutral-700">
                  Je souhaite m'inscrire à la newsletter
                </span>
              </label>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4">
              <p className="text-sm text-neutral-600">
                ℹ️ Un abonnement sera requis pour accéder aux fonctionnalités professionnelles.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors py-3 px-6 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Création...</span>
                  </div>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Créer mon compte pro</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
