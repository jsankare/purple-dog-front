"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.token && response.user) {
        window.dispatchEvent(new Event('auth-change'));
        if (response.user.role === 'particulier') {
          router.push('/dashboard/particulier');
        } else if (response.user.role === 'professionnel') {
          router.push('/dashboard/professionnel');
        } else {
          router.push('/profile');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-900 mb-2">
            Connexion
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-4"></div>
          <p className="text-neutral-600">
            Connectez-vous pour accéder à votre compte Purple Dog
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-neutral-200 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input 
                  id="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input 
                  id="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#4B2377] hover:text-purple-700 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button 
              className="w-full bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center justify-center gap-2 py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Pas encore de compte ?{' '}
            <Link 
              href="/signup" 
              className="text-[#4B2377] hover:text-purple-700 font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
