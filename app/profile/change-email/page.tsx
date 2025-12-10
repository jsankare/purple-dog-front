'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import { profileAPI } from '@/lib/api';

export default function ChangeEmailPage() {
  const [formData, setFormData] = useState({
    currentEmail: '',
    newEmail: '',
    confirmEmail: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        setFormData(prev => ({ ...prev, currentEmail: response.profile.email }));
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newEmail !== formData.confirmEmail) {
      setMessage({ type: 'error', text: 'Les emails ne correspondent pas' });
      return;
    }

    setSubmitting(true);

    try {
      await profileAPI.changeEmail(formData.newEmail, formData.password);
      setMessage({ type: 'success', text: 'Un email de vérification a été envoyé à votre nouvelle adresse' });
      setFormData({ ...formData, newEmail: '', confirmEmail: '', password: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4B2377] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className="text-neutral-600 hover:text-[#4B2377] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">
              Changer l'<span className="text-[#4B2377] font-normal">Email</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#4B2377]" />
            </div>
            <div>
              <h2 className="text-xl font-light text-neutral-900">Modifier votre adresse email</h2>
              <p className="text-sm text-neutral-500">Un email de vérification sera envoyé à la nouvelle adresse</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                Email actuel
              </label>
              <input
                type="email"
                id="currentEmail"
                name="currentEmail"
                value={formData.currentEmail}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                Nouvel email
              </label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                required
                placeholder="nouveau.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirmer le nouvel email
              </label>
              <input
                type="email"
                id="confirmEmail"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                required
                placeholder="nouveau.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                required
                placeholder="Confirmez avec votre mot de passe"
              />
            </div>

            <div className="bg-purple-50 border border-[#4B2377]/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#4B2377] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-neutral-700">
                  <p className="font-medium text-[#4B2377] mb-1">Important</p>
                  <p>Vous recevrez un email de vérification à votre nouvelle adresse. Vous devrez cliquer sur le lien de vérification pour finaliser le changement.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-neutral-200">
              <Link
                href="/profile"
                className="flex-1 px-6 py-3 text-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Changer l\'email'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
