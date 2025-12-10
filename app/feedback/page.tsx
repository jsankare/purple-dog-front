'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [npsScore, setNpsScore] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stars === 0 || npsScore === 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ stars, npsScore, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 border-2 border-[#4B2377] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#4B2377]" />
          </div>
          <h1 className="text-2xl font-serif text-neutral-900 mb-4">
            Merci pour votre retour
          </h1>
          <p className="text-neutral-600 mb-6 text-sm leading-relaxed">
            Votre avis a été enregistré avec succès.
          </p>
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#4B2377] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4 text-center">
            Partagez votre expérience
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mx-auto mb-6"></div>
          <p className="text-neutral-600 text-center leading-relaxed">
            Votre avis nous est précieux et nous aide à perfectionner nos services
          </p>
        </div>

        <div className="bg-white border border-neutral-200 shadow-sm">
          <div className="border-b border-neutral-200 px-8 py-6">
            <h2 className="text-xl font-serif text-neutral-900">Évaluation</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {error && (
              <div className="border-l-4 border-red-800 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-6 tracking-wide uppercase">
                Qualité du service <span className="text-red-800">*</span>
              </label>
              <div className="flex items-center gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStars(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-all hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredStar || stars)
                          ? 'fill-amber-600 text-amber-600'
                          : 'text-neutral-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {stars > 0 && (
                <p className="text-sm text-neutral-500 italic">
                  {stars === 1 && 'Très insatisfait'}
                  {stars === 2 && 'Insatisfait'}
                  {stars === 3 && 'Neutre'}
                  {stars === 4 && 'Satisfait'}
                  {stars === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-6 tracking-wide uppercase">
                Recommandation <span className="text-red-800">*</span>
              </label>
              <div className="grid grid-cols-10 gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsScore(score)}
                    className={`h-12 border transition-all ${
                      npsScore === score
                        ? 'border-[#4B2377] bg-[#4B2377] text-white'
                        : 'border-neutral-300 hover:border-[#4B2377] text-neutral-700'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-neutral-500 italic">
                <span>Peu probable</span>
                <span>Très probable</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-4 tracking-wide uppercase">
                Commentaire <span className="text-neutral-400">(optionnel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                placeholder="Partagez vos impressions..."
                className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400"
              />
              <p className="text-xs text-neutral-400 mt-2">
                {comment.length} caractère{comment.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || stars === 0 || npsScore === 0}
                className="w-full bg-[#4B2377] text-white py-4 font-medium tracking-wide hover:bg-[#3d1d61] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer mon avis</span>
                  </>
                )}
              </button>
              <p className="text-xs text-neutral-500 text-center mt-4">
                <span className="text-red-800">*</span> Champs obligatoires
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 border-l-2 border-neutral-300 bg-[#F1EAF8] px-6 py-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Vos données sont strictement confidentielles et utilisées uniquement pour améliorer la qualité de nos services.
          </p>
        </div>
      </div>
    </div>
  );
}
