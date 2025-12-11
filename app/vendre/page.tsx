'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Upload, X, Plus, Save, Info,
  Tag, Ruler, Weight, FileText, Image as ImageIcon,
  Euro, Gavel, Zap
} from 'lucide-react';
import { objectsAPI } from '@/lib/api';

export default function VendrePage() {
  const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    description: '',
    price: '',
    saleMode: 'auction',
    startingPrice: '',
    reservePrice: '',
    auctionDuration: '7', 
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/objects/categories`);
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'price' && value) {
      const price = parseFloat(value);
      if (!isNaN(price)) {
        const startingPrice = (price * 0.9).toFixed(2);
        setFormData(prev => ({ 
          ...prev, 
          startingPrice,
          reservePrice: value
        }));
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files!);
      if (photos.length + newPhotos.length > 20) {
        setMessage({ type: 'error', text: 'Maximum 20 photos autorisées' });
        return;
      }
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (photos.length < 10) {
      setMessage({ type: 'error', text: 'Minimum 10 photos requises' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('length', formData.length);
      formDataToSend.append('width', formData.width);
      formDataToSend.append('height', formData.height);
      formDataToSend.append('weight', formData.weight);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('saleMode', formData.saleMode);
      
      if (formData.saleMode === 'auction') {
        formDataToSend.append('startingPrice', formData.startingPrice);
        formDataToSend.append('reservePrice', formData.reservePrice);
      }
      
      documents.forEach((doc, index) => {
        formDataToSend.append(`document_${index}`, doc);
      });
      
      photos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo);
      });

      const data = await objectsAPI.createObject(formDataToSend);

      setMessage({ type: 'success', text: 'Objet publié avec succès et maintenant visible sur la plateforme !' });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-900 mb-2">
            Vendre un objet
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-4"></div>
          <p className="text-neutral-600">
            Publiez votre objet de valeur sur notre plateforme pour atteindre les meilleurs acheteurs
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-[#4B2377]" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Informations générales
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom de l'objet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="Ex: Vase Ming Dynasty"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors bg-white"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez votre objet en détail : origine, histoire, état, particularités..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Ruler className="w-5 h-5 text-[#4B2377]" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Dimensions et poids
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-neutral-700 mb-2">
                  Longueur (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label htmlFor="width" className="block text-sm font-medium text-neutral-700 mb-2">
                  Largeur (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-neutral-700 mb-2">
                  Hauteur (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 mb-2">
                  Poids (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-[#4B2377]" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Documents
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Certificat d'authenticité, preuve d'achat, ou tout document en lien avec l'objet
              </p>
              
              <div className="border-2 border-dashed border-neutral-300 hover:border-[#4B2377] transition-colors p-8 text-center">
                <input
                  type="file"
                  id="documents"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label htmlFor="documents" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">
                    Cliquez pour ajouter des documents
                  </p>
                  <p className="text-sm text-neutral-500">
                    PDF, DOC, DOCX, JPG, PNG (max 10MB par fichier)
                  </p>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200">
                      <span className="text-sm text-neutral-700 truncate flex-1">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-[#4B2377]" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Photos de l'objet
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Minimum 10 photos requises</p>
                  <p>Incluez des photos sous tous les angles : avant, arrière, dessus, dessous, signature, tranches, détails, etc.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-neutral-300 hover:border-[#4B2377] transition-colors p-8 text-center">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="photos" className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">
                    Cliquez pour ajouter des photos
                  </p>
                  <p className="text-sm text-neutral-500">
                    JPG, PNG (max 5MB par photo, max 20 photos)
                  </p>
                  <p className="text-sm text-[#4B2377] mt-2 font-medium">
                    {photos.length} / 10 minimum (20 max)
                  </p>
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img 
                        src={URL.createObjectURL(photo)} 
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Euro className="w-5 h-5 text-[#4B2377]" />
              <h2 className="text-xl font-semibold text-neutral-900">
                Prix et mode de vente
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-2">
                  Prix souhaité (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-4">
                  Mode de vente <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative border-2 p-6 cursor-pointer transition-all ${
                    formData.saleMode === 'auction' 
                      ? 'border-[#4B2377] bg-purple-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="saleMode"
                      value="auction"
                      checked={formData.saleMode === 'auction'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                      <Gavel className={`w-8 h-8 flex-shrink-0 ${
                        formData.saleMode === 'auction' ? 'text-[#4B2377]' : 'text-neutral-400'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">Enchères</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          Les professionnels enchérissent pendant 7 jours. Prix de démarrage à -10% de votre prix souhaité.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className={`relative border-2 p-6 cursor-pointer transition-all ${
                    formData.saleMode === 'quick-sale' 
                      ? 'border-[#4B2377] bg-purple-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="saleMode"
                      value="quick-sale"
                      checked={formData.saleMode === 'quick-sale'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                      <Zap className={`w-8 h-8 flex-shrink-0 ${
                        formData.saleMode === 'quick-sale' ? 'text-[#4B2377]' : 'text-neutral-400'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">Vente rapide</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          La première offre au prix souhaité remporte l'objet immédiatement.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {formData.saleMode === 'auction' && (
                <div className="border-t border-neutral-200 pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startingPrice" className="block text-sm font-medium text-neutral-700 mb-2">
                        Prix de démarrage (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="startingPrice"
                        name="startingPrice"
                        value={formData.startingPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Par défaut : -10% du prix souhaité
                      </p>
                    </div>

                    <div>
                      <label htmlFor="reservePrice" className="block text-sm font-medium text-neutral-700 mb-2">
                        Prix de réserve (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="reservePrice"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Prix minimum pour vendre l'objet
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Règles des enchères
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Durée : 7 jours par défaut</li>
                      <li>Extension de 10 minutes si enchère dans la dernière heure</li>
                      <li>Paliers d'enchères automatiques selon le prix</li>
                      <li>Enchères automatiques possibles pour les acheteurs</li>
                      <li>L'objet n'est vendu que si le prix de réserve est atteint</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end bg-white border border-neutral-200 p-6">
            <Link
              href="/"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-[#4B2377] hover:text-[#4B2377] transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading || photos.length < 10}
              className="px-6 py-3 bg-[#4B2377] text-white hover:bg-[#3d1d61] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publication...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Publier l'objet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
