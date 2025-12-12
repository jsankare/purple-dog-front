"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { ArrowLeft, Save, Eye, CheckCircle, X, AlertCircle } from 'lucide-react';
import { getCategories, formatCategoriesForSelect } from '@/lib/categories';

export default function ModifierObjetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [object, setObject] = useState<any>(null);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadObject();
    loadCategories();
  }, [id]);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(formatCategoriesForSelect(cats, false));
  };

  const loadObject = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/objects/${id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setObject(data);
      } else {
        setErrorMessage('Erreur lors du chargement de l\'objet');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors du chargement de l\'objet');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/objects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(object),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Erreur lors de la modification');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors de la modification');
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-[#4B2377] rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Objet non trouvé</p>
          <Link href="/dashboard/particulier" className="text-[#4B2377] hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/dashboard/particulier" 
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-neutral-900 mb-2">
                Modifier l'objet
              </h1>
              <div className="w-24 h-px bg-[#4B2377]"></div>
            </div>
            <Link
              href={`/objets/${id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 hover:border-[#4B2377] text-neutral-700 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Voir l'annonce</span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Nom de l'objet *
              </label>
              <input
                type="text"
                value={object.name || ''}
                onChange={(e) => setObject({ ...object, name: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Catégorie *
              </label>
              <select
                value={object.category || ''}
                onChange={(e) => setObject({ ...object, category: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Description *
              </label>
              <textarea
                value={object.description || ''}
                onChange={(e) => setObject({ ...object, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                required
              />
            </div>

            {/* Prix et Mode de vente */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  value={object.price || ''}
                  onChange={(e) => setObject({ ...object, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Mode de vente *
                </label>
                <select
                  value={object.saleMode || 'quick-sale'}
                  onChange={(e) => setObject({ ...object, saleMode: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                >
                  <option value="quick-sale">Vente rapide</option>
                  <option value="auction">Enchères</option>
                </select>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                Photos actuelles
              </label>
              {object.photos && object.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {object.photos.map((photo: any, index: number) => (
                    <div key={index} className="relative aspect-square border-2 border-neutral-200 rounded overflow-hidden group">
                      <img
                        src={photo.photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm">Photo {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">Aucune photo</p>
              )}
              <p className="text-xs text-neutral-500 mt-2">
                ℹ️ Pour modifier les photos, veuillez contacter un administrateur ou utiliser le panel admin Payload
              </p>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                Dimensions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Longueur (cm)</label>
                  <input
                    type="number"
                    value={object.dimensions?.length || ''}
                    onChange={(e) => setObject({ 
                      ...object, 
                      dimensions: { ...object.dimensions, length: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Largeur (cm)</label>
                  <input
                    type="number"
                    value={object.dimensions?.width || ''}
                    onChange={(e) => setObject({ 
                      ...object, 
                      dimensions: { ...object.dimensions, width: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Hauteur (cm)</label>
                  <input
                    type="number"
                    value={object.dimensions?.height || ''}
                    onChange={(e) => setObject({ 
                      ...object, 
                      dimensions: { ...object.dimensions, height: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    value={object.dimensions?.weight || ''}
                    onChange={(e) => setObject({ 
                      ...object, 
                      dimensions: { ...object.dimensions, weight: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Statut
              </label>
              <select
                value={object.status || 'active'}
                onChange={(e) => setObject({ ...object, status: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded focus:ring-2 focus:ring-[#4B2377] focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="pending">En attente de validation</option>
                <option value="active">Actif</option>
                <option value="sold">Vendu</option>
                <option value="withdrawn">Retiré</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4B2377] hover:bg-purple-700 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
              <Link
                href="/dashboard/particulier"
                className="px-6 py-3 border-2 border-[#4B2377] text-[#4B2377] font-medium rounded hover:bg-purple-50 transition-colors text-center"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif text-neutral-900 mb-2">
                Modifications enregistrées !
              </h3>
              <p className="text-neutral-600 mb-6">
                Votre objet a été mis à jour avec succès.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => router.push('/dashboard/particulier')}
                  className="flex-1 px-6 py-3 bg-[#4B2377] hover:bg-purple-700 text-white font-medium rounded transition-colors"
                >
                  Retour au dashboard
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-3 border-2 border-[#4B2377] text-[#4B2377] font-medium rounded hover:bg-purple-50 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-serif text-neutral-900 mb-2">
                Une erreur est survenue
              </h3>
              <p className="text-neutral-600 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-6 py-3 bg-[#4B2377] hover:bg-purple-700 text-white font-medium rounded transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
