'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  ShoppingBag,
  Gavel,
  Settings,
  LogOut
} from 'lucide-react';
import { profileAPI, authAPI } from '@/lib/api';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  subscription?: string;
  role?: string;
  stats: {
    purchases: number;
    sales: number;
    bids: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      // Supprimer le cookie manuellement
      document.cookie = 'payload-token=; Max-Age=0; path=/;';
      // Rediriger vers la page de connexion
      router.push('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      // Même en cas d'erreur, supprimer le token et rediriger
      document.cookie = 'payload-token=; Max-Age=0; path=/;';
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        const user = response.profile;
        
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur';
        const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        });
        
        setProfile({
          name,
          email: user.email,
          memberSince,
          subscription: user.role === 'professionnel' ? 'Premium' : 'Standard',
          role: user.role,
          stats: {
            purchases: 0, // TODO: Récupérer les vraies statistiques
            sales: 0,
            bids: 0
          }
        });
      } catch (err: any) {
        console.error('Erreur lors du chargement du profil:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4B2377] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[#4B2377] to-purple-700"></div>
              <div className="px-6 pb-6 -mt-12">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-neutral-400" />
                </div>
                <h2 className="mt-4 text-2xl font-light text-neutral-900">{profile?.name}</h2>
                <p className="text-sm text-neutral-500 mt-1">{profile?.email}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#4B2377]/10 text-[#4B2377] text-xs font-medium rounded-full">
                    {profile?.subscription}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Membre depuis {profile?.memberSince}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wider">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-[#4B2377]" />
                    </div>
                    <span className="text-sm text-neutral-600">Achats</span>
                  </div>
                  <span className="text-lg font-light text-neutral-900">{profile?.stats.purchases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#4B2377]" />
                    </div>
                    <span className="text-sm text-neutral-600">Ventes</span>
                  </div>
                  <span className="text-lg font-light text-neutral-900">{profile?.stats.sales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-[#4B2377]" />
                    </div>
                    <span className="text-sm text-neutral-600">Enchères</span>
                  </div>
                  <span className="text-lg font-light text-neutral-900">{profile?.stats.bids}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
              <h3 className="text-xl font-light text-neutral-900 mb-6 flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#4B2377]" />
                Paramètres du compte
              </h3>
              
              <div className="space-y-4">
                <Link 
                  href="/profile/edit"
                  className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200/50 hover:border-[#4B2377]/30 hover:bg-purple-50/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#4B2377]/10 rounded-full flex items-center justify-center transition-colors">
                      <UserCircle className="w-6 h-6 text-neutral-600 group-hover:text-[#4B2377] transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Modifier le profil</h4>
                      <p className="text-sm text-neutral-500">Mettez à jour vos informations personnelles</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/change-email"
                  className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200/50 hover:border-[#4B2377]/30 hover:bg-purple-50/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#4B2377]/10 rounded-full flex items-center justify-center transition-colors">
                      <Mail className="w-6 h-6 text-neutral-600 group-hover:text-[#4B2377] transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Changer l'email</h4>
                      <p className="text-sm text-neutral-500">Modifiez votre adresse email</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/change-password"
                  className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200/50 hover:border-[#4B2377]/30 hover:bg-purple-50/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#4B2377]/10 rounded-full flex items-center justify-center transition-colors">
                      <Lock className="w-6 h-6 text-neutral-600 group-hover:text-[#4B2377] transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Changer le mot de passe</h4>
                      <p className="text-sm text-neutral-500">Mettez à jour votre mot de passe</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/notifications"
                  className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200/50 hover:border-[#4B2377]/30 hover:bg-purple-50/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-100 group-hover:bg-[#4B2377]/10 rounded-full flex items-center justify-center transition-colors">
                      <Bell className="w-6 h-6 text-neutral-600 group-hover:text-[#4B2377] transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Notifications</h4>
                      <p className="text-sm text-neutral-500">Gérez vos préférences de notification</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/50 p-8">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-3 text-neutral-600 hover:text-[#4B2377] hover:bg-purple-50 rounded-lg transition-colors border border-neutral-200 hover:border-[#4B2377]/30"
              >
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
