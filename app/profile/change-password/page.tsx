'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Save } from 'lucide-react';
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
      await profileAPI.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
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
      <CheckCircle2 className={`w-4 h-4 ${met ? 'fill-green-600' : ''}`} />
      <span>{text}</span>
    </div>
  );

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
            Changer le mot de passe
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
              <Lock className="w-6 h-6 text-[#4B2377]" />
              <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">
                Mot de passe actuel
              </h3>
            </div>
            
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                required
                placeholder="Votre mot de passe actuel"
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

          <div className="bg-white border border-neutral-200 p-8">
            <h3 className="text-sm font-medium text-neutral-900 mb-6 uppercase tracking-wide">
              Nouveau mot de passe
            </h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm text-neutral-700 mb-2">
                  Nouveau mot de passe <span className="text-red-800">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
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
              </div>

              {formData.newPassword && (
                <div className="border-l-2 border-neutral-200 bg-neutral-50 px-4 py-4 space-y-2">
                  <p className="text-sm font-medium text-neutral-700 mb-3">Critères de sécurité :</p>
                  <StrengthIndicator met={passwordStrength.length} text="Au moins 8 caractères" />
                  <StrengthIndicator met={passwordStrength.uppercase} text="Une lettre majuscule" />
                  <StrengthIndicator met={passwordStrength.lowercase} text="Une lettre minuscule" />
                  <StrengthIndicator met={passwordStrength.number} text="Un chiffre" />
                  <StrengthIndicator met={passwordStrength.special} text="Un caractère spécial (!@#$...)" />
                </div>
              )}

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-neutral-700 mb-2">
                  Confirmer le nouveau mot de passe <span className="text-red-800">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
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
                  <span>Modification...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Changer le mot de passe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
