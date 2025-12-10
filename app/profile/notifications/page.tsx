'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Mail, Save } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin"></div>
      </div>
    );
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center transition-colors border-2 ${
        enabled ? 'bg-[#4B2377] border-[#4B2377]' : 'bg-neutral-200 border-neutral-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#4B2377] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au profil</span>
          </Link>
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Notifications
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

        <div className="bg-white border border-neutral-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="w-6 h-6 text-[#4B2377]" />
            <h3 className="text-sm font-medium text-neutral-900 uppercase tracking-wide">
              Préférences de notification
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between p-6 border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 border-2 border-neutral-200 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#4B2377]" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Newsletter</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Recevez notre newsletter par email avec les dernières actualités, nouveaux articles et offres exclusives
                  </p>
                </div>
              </div>
              <Toggle 
                enabled={newsletterEnabled} 
                onChange={() => setNewsletterEnabled(!newsletterEnabled)} 
              />
            </div>

            <div className="border-l-2 border-neutral-300 bg-[#F1EAF8] px-4 py-3">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Notre newsletter est envoyée à votre adresse email enregistrée. Vous recevrez des actualités sur les nouveautés du site et nos offres exclusives. Vous pouvez vous désabonner à tout moment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link
            href="/profile"
            className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors"
          >
            Annuler
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
