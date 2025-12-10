'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { profileAPI } from '@/lib/api';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    const allRequirementsMet = Object.values(passwordStrength).every(v => v);
    if (!allRequirementsMet) {
      setMessage({ type: 'error', text: 'Le mot de passe ne respecte pas tous les critères de sécurité' });
      return;
    }

    setSubmitting(true);

    try {
      await profileAPI.changePassword(formData.currentPassword, formData.newPassword);
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const StrengthIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-neutral-400'}`}>
      <CheckCircle2 className={`w-4 h-4 ${met ? 'fill-green-600' : 'fill-neutral-300'}`} />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link 
          href="/profile" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#4B2377] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#4B2377]" />
            </div>
            <div>
              <h2 className="text-xl font-light text-neutral-900">Modifier votre mot de passe</h2>
              <p className="text-sm text-neutral-500">Assurez-vous d'utiliser un mot de passe sécurisé</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Critères de sécurité:</p>
                  <StrengthIndicator met={passwordStrength.length} text="Au moins 8 caractères" />
                  <StrengthIndicator met={passwordStrength.uppercase} text="Une lettre majuscule" />
                  <StrengthIndicator met={passwordStrength.lowercase} text="Une lettre minuscule" />
                  <StrengthIndicator met={passwordStrength.number} text="Un chiffre" />
                  <StrengthIndicator met={passwordStrength.special} text="Un caractère spécial (!@#$...)" />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 focus:border-[#4B2377] focus:ring-2 focus:ring-[#4B2377]/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-neutral-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Changer le mot de passe'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
