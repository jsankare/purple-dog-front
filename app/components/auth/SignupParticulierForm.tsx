"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Mail, Lock, User, MapPin, Home, ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function SignupParticulierForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    ageCertified: false,
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
      if (!form.street || !form.city || !form.postalCode) {
        return setErr("Veuillez remplir tous les champs d'adresse obligatoires");
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
    
    if (!form.ageCertified) {
      return setErr("Vous devez certifier avoir plus de 18 ans.");
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
        role: "particulier",
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        isOver18: form.ageCertified,
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
                  placeholder="jean.dupont@exemple.com"
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

        {/* Step 2: Address */}
        {step === 2 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Votre adresse</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => update("street", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="123 Rue de la Paix"
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
                    placeholder="75001"
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
                  checked={form.ageCertified}
                  onChange={(e) => update("ageCertified", e.target.checked)}
                  className="mt-0.5 w-5 h-5 border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]"
                />
                <span className="text-sm text-neutral-700">
                  Je certifie avoir plus de 18 ans <span className="text-red-500">*</span>
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
                    <span>Créer mon compte</span>
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
