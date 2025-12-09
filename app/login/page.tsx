'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'paulbecue3105@gmail.com',
    password: 'Azerty1231'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-neutral-900 mb-2">
            <span className="text-[#4B2377] font-normal">Purple</span> Dog
          </h1>
          <p className="text-neutral-600">Plateforme de vente et enchères d'art</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#4B2377]" />
            </div>
            <div>
              <h2 className="text-xl font-light text-neutral-900">Connexion</h2>
              <p className="text-sm text-neutral-500">Accédez à votre compte</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                  required
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Première visite ?{' '}
              <a href="#" className="text-[#4B2377] hover:underline">
                Créer un compte
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          En vous connectant, vous acceptez nos CGU et notre politique de confidentialité
        </p>
      </div>
    </div>
  );
}
