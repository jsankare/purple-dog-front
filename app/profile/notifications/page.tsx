'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Mail } from 'lucide-react';
import { profileAPI } from '@/lib/api';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await profileAPI.getNotifications();
        setNewsletterEnabled(response.notifications.newsletterSubscription);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await profileAPI.updateNotifications(newsletterEnabled);
      setMessage({ type: 'success', text: 'Préférences enregistrées avec succès' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4B2377] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#4B2377]' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link 
          href="/profile" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#4B2377] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#4B2377]" />
            </div>
            <div>
              <h2 className="text-xl font-light text-neutral-900">Préférences de notification</h2>
              <p className="text-sm text-neutral-500">Gérez comment vous souhaitez être informé</p>
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

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#4B2377]" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">Newsletter</h3>
                  <p className="text-sm text-neutral-600">
                    Recevez notre newsletter par email avec les dernières actualités, nouveaux articles et offres exclusives
                  </p>
                </div>
              </div>
              <Toggle 
                enabled={newsletterEnabled} 
                onChange={() => setNewsletterEnabled(!newsletterEnabled)} 
              />
            </div>
          </div>

          <div className="mt-8 bg-purple-50 border border-[#4B2377]/20 rounded-lg p-4">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-[#4B2377] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-700">
                <p className="font-medium text-[#4B2377] mb-1">À propos de la newsletter</p>
                <p>Notre newsletter est envoyée à votre adresse email enregistrée. Vous recevrez des actualités sur les nouveautés du site et nos offres exclusives. Vous pouvez vous désabonner à tout moment.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-neutral-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-[#4B2377] text-white hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Enregistrer les préférences'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
