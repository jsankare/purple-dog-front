'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCircle, 
  Mail, 
  Lock, 
  Bell, 
  ShoppingBag,
  Gavel,
  LogOut,
  Star,
  MessageSquare,
  Trash2,
  Calendar
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

interface Feedback {
  id: number;
  stars: number;
  npsScore: number;
  comment?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      document.cookie = 'payload-token=; Max-Age=0; path=/;';
      router.push('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      document.cookie = 'payload-token=; Max-Age=0; path=/;';
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/my-feedback`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!confirm('Êtes-vous certain de vouloir supprimer cet avis ?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter(f => f.id !== id));
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
            purchases: 0,
            sales: 0,
            bids: 0
          }
        });

        await fetchFeedbacks();
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
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Mon profil
          </h1>
          <div className="w-24 h-px bg-[#4B2377]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200">
              <div className="h-20 bg-[#4B2377]"></div>
              <div className="px-6 pb-6 -mt-10">
                <div className="w-20 h-20 bg-white border-2 border-neutral-200 flex items-center justify-center">
                  <UserCircle className="w-16 h-16 text-neutral-400" />
                </div>
                <h2 className="mt-4 text-2xl font-serif text-neutral-900">{profile?.name}</h2>
                <p className="text-sm text-neutral-500 mt-1">{profile?.email}</p>
                <div className="mt-4 text-xs text-neutral-500">
                  Membre depuis {profile?.memberSince}
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wide">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#4B2377]" />
                    <span className="text-sm text-neutral-600">Achats</span>
                  </div>
                  <span className="text-lg font-serif text-neutral-900">{profile?.stats.purchases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gavel className="w-5 h-5 text-[#4B2377]" />
                    <span className="text-sm text-neutral-600">Enchères</span>
                  </div>
                  <span className="text-lg font-serif text-neutral-900">{profile?.stats.bids}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-neutral-600">Avis donnés</span>
                  </div>
                  <span className="text-lg font-serif text-neutral-900">{feedbacks.length}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-neutral-600 hover:text-[#4B2377] bg-white border border-neutral-200 hover:border-[#4B2377] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Se déconnecter</span>
            </button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-neutral-200 p-8">
              <h3 className="text-xl font-serif text-neutral-900 mb-6">
                Paramètres du compte
              </h3>
              
              <div className="space-y-3">
                <Link 
                  href="/profile/edit"
                  className="flex items-center justify-between p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Modifier le profil</h4>
                      <p className="text-sm text-neutral-500">Informations personnelles</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/change-email"
                  className="flex items-center justify-between p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Changer l'email</h4>
                      <p className="text-sm text-neutral-500">Adresse email</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/change-password"
                  className="flex items-center justify-between p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Changer le mot de passe</h4>
                      <p className="text-sm text-neutral-500">Sécurité</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link 
                  href="/profile/notifications"
                  className="flex items-center justify-between p-4 border border-neutral-200 hover:border-[#4B2377] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" />
                    <div>
                      <h4 className="font-medium text-neutral-900">Notifications</h4>
                      <p className="text-sm text-neutral-500">Préférences</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#4B2377] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-neutral-900">
                  Mes avis
                </h3>
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-2 bg-[#4B2377] text-white px-4 py-2 text-sm font-medium tracking-wide hover:bg-[#3d1d61] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Donner un avis</span>
                </Link>
              </div>

              {feedbacks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-200">
                  <Star className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">Aucun avis pour le moment</p>
                  <Link
                    href="/feedback"
                    className="inline-flex items-center gap-2 text-[#4B2377] hover:underline text-sm"
                  >
                    Donner mon premier avis
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.slice(0, 3).map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border border-neutral-200 p-6 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= feedback.stars
                                    ? 'fill-amber-600 text-amber-600'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-neutral-600">
                            Recommandation : <span className="font-medium text-neutral-900">{feedback.npsScore}/10</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          disabled={deletingId === feedback.id}
                          className="p-2 text-neutral-400 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          {deletingId === feedback.id ? (
                            <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {feedback.comment && (
                        <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                          {feedback.comment}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(feedback.createdAt)}</span>
                      </div>
                    </div>
                  ))}

                  {feedbacks.length > 3 && (
                    <div className="text-center pt-4">
                      <Link
                        href="/feedback/my-feedback"
                        className="text-sm text-[#4B2377] hover:underline"
                      >
                        Voir tous mes avis ({feedbacks.length})
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
