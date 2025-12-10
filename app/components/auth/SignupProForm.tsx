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

    setLoading(true);
    try {
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
      <div className="flex items-center justify-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 1 ? 'bg-[#4B2377] text-white' : 'bg-neutral-200 text-neutral-500'}`}>
          1
        </div>
        <div className={`h-1 w-16 ${step >= 2 ? 'bg-[#4B2377]' : 'bg-neutral-200'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 2 ? 'bg-[#4B2377] text-white' : 'bg-neutral-200 text-neutral-500'}`}>
          2
        </div>
        <div className={`h-1 w-16 ${step >= 3 ? 'bg-[#4B2377]' : 'bg-neutral-200'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= 3 ? 'bg-[#4B2377] text-white' : 'bg-neutral-200 text-neutral-500'}`}>
          3
        </div>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs">✕</span>
          </div>
          <p className="text-sm text-red-700">{err}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <h3 className="text-lg font-medium text-neutral-900">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">E-mail *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                  placeholder="contact@entreprise.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Minimum 8 caractères</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Confirmer *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password"
                    minLength={8}
                    value={form.passwordConfirm}
                    onChange={(e) => update("passwordConfirm", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-[#4B2377] to-purple-700 hover:from-[#3a1b5f] hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Continuer</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-medium text-neutral-900">Informations professionnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Raison sociale *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="Entreprise SARL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">SIRET * (14 chiffres)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.siret}
                    onChange={(e) => update("siret", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="12345678900012"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse professionnelle *</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => update("street", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                  placeholder="123 Avenue des Champs-Élysées"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Code postal *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="75008"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Ville *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                    placeholder="Paris"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Site web</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
                  placeholder="https://www.monentreprise.com"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-neutral-300 text-neutral-700 font-medium py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-[#4B2377] to-purple-700 hover:from-[#3a1b5f] hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-medium text-neutral-900">Conditions</h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.cgvAccepted}
                  onChange={(e) => update("cgvAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
                />
                <span className="text-sm text-neutral-700">J'accepte les CGV *</span>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mandateAccepted}
                  onChange={(e) => update("mandateAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
                />
                <span className="text-sm text-neutral-700">J'accepte le mandat d'apport d'affaire *</span>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rgpdAccepted}
                  onChange={(e) => update("rgpdAccepted", e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
                />
                <span className="text-sm text-neutral-700">J'accepte la politique RGPD *</span>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={(e) => update("newsletter", e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
                />
                <span className="text-sm text-neutral-700">Je souhaite m'inscrire à la newsletter</span>
              </label>
            </div>

            <div className="bg-purple-50 border border-[#4B2377]/20 rounded-lg p-4 mt-4">
              <p className="text-xs text-neutral-600">
                Un abonnement sera requis pour accéder aux fonctionnalités professionnelles.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-neutral-300 text-neutral-700 font-medium py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#4B2377] to-purple-700 hover:from-[#3a1b5f] hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
