'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Save } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#4B2377] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au profil</span>
          </Link>
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Changer l'email
          </h1>
          <div className="w-24 h-px bg-[#4B2377]"></div>
        </div>

        {message && (
          <div className={`mb-6 p-4 border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-800 text-green-800' 
              : 'bg-red-50 border-red-800 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-[#4B2377]" />
              <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">
                Email actuel
              </h3>
            </div>
            
            <input
              type="email"
              value={formData.currentEmail}
              disabled
              className="w-full px-4 py-3 border border-neutral-300 bg-neutral-100 text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <h3 className="text-sm font-medium text-neutral-900 mb-6 uppercase tracking-wide">
              Nouveau email
            </h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="newEmail" className="block text-sm text-neutral-700 mb-2">
                  Nouvel email <span className="text-red-800">*</span>
                </label>
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={formData.newEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  required
                  placeholder="nouveau.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="confirmEmail" className="block text-sm text-neutral-700 mb-2">
                  Confirmer le nouvel email <span className="text-red-800">*</span>
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  required
                  placeholder="nouveau.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-neutral-700 mb-2">
                  Mot de passe actuel <span className="text-red-800">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  required
                  placeholder="Confirmez avec votre mot de passe"
                />
              </div>

              <div className="border-l-2 border-neutral-300 bg-[#F1EAF8] px-4 py-3">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Un email de vérification sera envoyé à votre nouvelle adresse. Vous devrez cliquer sur le lien de vérification pour finaliser le changement.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/profile"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Changer l'email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
