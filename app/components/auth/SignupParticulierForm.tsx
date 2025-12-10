"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Mail, Lock, User, MapPin, Home, ArrowRight, Check } from "lucide-react";

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

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
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
    if (form.password !== form.passwordConfirm) {
      return setErr("Les mots de passe ne correspondent pas.");
    }
    if (form.password.length < 8) {
      return setErr("Le mot de passe doit contenir au moins 8 caractères.");
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Prénom *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              required
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
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
              placeholder="Dupont"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">E-mail *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
            placeholder="jean.dupont@exemple.com"
          />
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Mot de passe *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="password"
              required
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
              required
              minLength={8}
              value={form.passwordConfirm}
              onChange={(e) => update("passwordConfirm", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Rue *</label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            required
            value={form.street}
            onChange={(e) => update("street", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
            placeholder="123 Rue de la Paix"
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
              required
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
              placeholder="75001"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Ville *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2377]/20 focus:border-[#4B2377] transition-all"
              placeholder="Paris"
            />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-4">
        <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
          <input
            id="age"
            type="checkbox"
            checked={form.ageCertified}
            onChange={(e) => update("ageCertified", e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
            required
          />
          <span className="text-sm text-neutral-700">Je certifie avoir plus de 18 ans *</span>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
          <input
            id="rgpd"
            type="checkbox"
            checked={form.rgpdAccepted}
            onChange={(e) => update("rgpdAccepted", e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
            required
          />
          <span className="text-sm text-neutral-700">J'accepte la politique RGPD *</span>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-[#4B2377]/30 transition-colors cursor-pointer">
          <input
            id="newsletter"
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => update("newsletter", e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-neutral-300 text-[#4B2377] focus:ring-[#4B2377]/20"
          />
          <span className="text-sm text-neutral-700">Je souhaite m'inscrire à la newsletter</span>
        </label>
      </div>

      {/* Error Message */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs">✕</span>
          </div>
          <p className="text-sm text-red-700">{err}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#4B2377] to-purple-700 hover:from-[#3a1b5f] hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Création du compte...</span>
          </div>
        ) : (
          <>
            <Check className="w-5 h-5" />
            <span>Créer mon compte</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
