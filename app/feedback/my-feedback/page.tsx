'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Feedback {
  id: number;
  stars: number;
  npsScore: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/my-feedback`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setFeedbacks(data.feedbacks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement de vos avis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">
            Mes avis
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-6"></div>
          <p className="text-neutral-600 leading-relaxed">
            Retrouvez l'ensemble de vos évaluations
          </p>
        </div>

        <div className="mb-8">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 bg-[#4B2377] text-white px-6 py-3 font-medium tracking-wide hover:bg-[#3d1d61] transition-colors"
          >
            <span>Donner un nouvel avis</span>
          </Link>
        </div>

        {error && (
          <div className="border-l-4 border-red-800 bg-red-50 px-4 py-3 text-sm text-red-800 mb-8">
            {error}
          </div>
        )}

        {feedbacks.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-16 text-center">
            <div className="w-16 h-16 border-2 border-neutral-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-serif text-neutral-900 mb-4">
              Aucun avis pour le moment
            </h2>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Vous n'avez pas encore laissé d'évaluation.
            </p>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 bg-[#4B2377] text-white px-6 py-3 font-medium tracking-wide hover:bg-[#3d1d61] transition-colors"
            >
              <span>Donner mon premier avis</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= feedback.stars
                                  ? 'fill-amber-600 text-amber-600'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-neutral-600">Recommandation :</span>
                        <span className="font-medium text-neutral-900">
                          {feedback.npsScore}/10
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deletingId === feedback.id}
                      className="p-2 text-neutral-400 hover:text-red-800 transition-colors disabled:opacity-40"
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
                    <div className="border-l-2 border-neutral-200 bg-neutral-50 px-4 py-3 mb-6">
                      <p className="text-neutral-700 leading-relaxed">
                        {feedback.comment}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(feedback.createdAt)}</span>
                    </div>
                    {feedback.updatedAt !== feedback.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Modifié le {formatDate(feedback.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {feedbacks.length > 0 && (
          <div className="mt-12 bg-white border border-neutral-200 p-8">
            <h3 className="text-xl font-serif text-neutral-900 mb-6">
              Statistiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                  Moyenne qualité
                </p>
                <p className="text-4xl font-serif text-neutral-900">
                  {(feedbacks.reduce((sum, f) => sum + f.stars, 0) / feedbacks.length).toFixed(1)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">/ 5</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                  Moyenne NPS
                </p>
                <p className="text-4xl font-serif text-neutral-900">
                  {(feedbacks.reduce((sum, f) => sum + f.npsScore, 0) / feedbacks.length).toFixed(1)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">/ 10</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                  Total d'avis
                </p>
                <p className="text-4xl font-serif text-neutral-900">
                  {feedbacks.length}
                </p>
                <p className="text-sm text-neutral-500 mt-1">avis donné{feedbacks.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
