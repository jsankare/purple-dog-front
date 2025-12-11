"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Package, FileText, User, Heart, Eye } from 'lucide-react';

interface ObjectDetails {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  saleMode: string;
  status: string;
  photos?: Array<{ photo: { url: string; id: string } }>;
  documents?: Array<{ document: { url: string; filename: string }; description?: string }>;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  seller?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  auctionConfig?: {
    currentBid?: number;
    bidCount?: number;
    startingPrice?: number;
    reservePrice?: number;
    startDate?: string;
    endDate?: string;
  };
  views?: number;
  favorites?: number;
  createdAt?: string;
}

function PhotoGallery({ photos }: { photos: Array<{ photo: { url: string; id: string } }> }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-400">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img
          src={photos[currentIndex]?.photo?.url}
          alt={`Photo ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-800" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6 text-neutral-800" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.photo.id}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-[#4B2377] ring-2 ring-[#4B2377]' : 'border-neutral-200 hover:border-[#4B2377]'
              }`}
            >
              <img
                src={photo.photo.url}
                alt={`Miniature ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('Terminée');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}j ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 text-2xl font-bold text-[#4B2377]">
      <Clock className="w-6 h-6" />
      <span>{timeLeft}</span>
    </div>
  );
}

export default function ObjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [object, setObject] = useState<ObjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [showAutoBid, setShowAutoBid] = useState(false);
  const [autoBidAmount, setAutoBidAmount] = useState('');

  useEffect(() => {
    fetchObjectDetails();
    incrementViewCount();
  }, [id]);

  const fetchObjectDetails = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/objects/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Objet chargé:', data);
      setObject(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'objet:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      await fetch(`${API_URL}/api/objects/${id}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  };

  const getBidIncrement = (currentPrice: number): number => {
    if (currentPrice < 100) return 10;
    if (currentPrice < 500) return 50;
    if (currentPrice < 1000) return 100;
    if (currentPrice < 5000) return 200;
    if (currentPrice < 10000) return 500;
    return 1000;
  };

  const handleQuickBuy = async () => {
    if (!object) return;
    
    if (!confirm(`Confirmer l'achat pour ${object.price.toLocaleString('fr-FR')} € ?`)) {
      return;
    }

    try {
      alert('Achat en cours... (API à implémenter)');
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert('Erreur lors de l\'achat');
    }
  };

  const handlePlaceBid = async (amount: number, isAuto: boolean = false) => {
    if (amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    try {
      const bidType = isAuto ? 'automatique' : 'manuelle';
      alert(`Enchère ${bidType} de ${amount.toLocaleString('fr-FR')} € placée ! (API à implémenter)`);
      setBidAmount('');
      setAutoBidAmount('');
      setShowAutoBid(false);
    } catch (error) {
      console.error('Erreur lors de l\'enchère:', error);
      alert('Erreur lors de l\'enchère');
    }
  };

  const categories = [
    { value: 'bijoux-montres', label: 'Bijoux & montres' },
    { value: 'meubles-anciens', label: 'Meubles anciens' },
    { value: 'objets-art-tableaux', label: 'Objets d\'art & tableaux' },
    { value: 'objets-collection', label: 'Objets de collection' },
    { value: 'vins-spiritueux', label: 'Vins & spiritueux' },
    { value: 'instruments-musique', label: 'Instruments de musique' },
    { value: 'livres-manuscrits', label: 'Livres & manuscrits' },
    { value: 'mode-luxe', label: 'Mode & luxe' },
    { value: 'horlogerie-pendules', label: 'Horlogerie' },
    { value: 'photographies-vintage', label: 'Photographies' },
    { value: 'vaisselle-argenterie', label: 'Vaisselle & argenterie' },
    { value: 'sculptures-decoratifs', label: 'Sculptures' },
    { value: 'vehicules-collection', label: 'Véhicules de collection' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-[#4B2377] rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-600">Chargement de l'objet...</p>
        </div>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-neutral-600 mb-4">Objet non trouvé</p>
          <Link href="/objets" className="text-[#4B2377] hover:text-purple-700 font-medium">
            Retour aux objets
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = object.saleMode === 'auction' && object.auctionConfig?.currentBid 
    ? object.auctionConfig.currentBid 
    : object.saleMode === 'auction' && object.auctionConfig?.startingPrice
    ? object.auctionConfig.startingPrice
    : object.price * 0.9;

  const increment = getBidIncrement(currentPrice);

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/objets" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux objets</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 border border-neutral-200">
            <PhotoGallery photos={object.photos || []} />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-neutral-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-xs bg-purple-50 text-[#4B2377] border border-purple-200 mb-3">
                    {categories.find(c => c.value === object.category)?.label || object.category}
                  </span>
                  <h1 className="text-3xl font-serif text-neutral-900 mb-2">
                    {object.name}
                  </h1>
                </div>
                <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <Heart className="w-6 h-6 text-neutral-400 hover:text-[#4B2377]" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{object.views || 0} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{object.favorites || 0} favoris</span>
                </div>
              </div>
            </div>

            {object.saleMode === 'auction' && object.auctionConfig ? (
              <div className="bg-white p-6 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Enchère actuelle</p>
                    <p className="text-4xl font-serif text-[#4B2377] font-bold">
                      {currentPrice.toLocaleString('fr-FR')} €
                    </p>
                    {object.auctionConfig.bidCount !== undefined && object.auctionConfig.bidCount > 0 && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {object.auctionConfig.bidCount} enchère{object.auctionConfig.bidCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  {object.auctionConfig.endDate && (
                    <div className="text-right">
                      <p className="text-sm text-neutral-600 mb-2">Temps restant</p>
                      <CountdownTimer endDate={object.auctionConfig.endDate} />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Prochaine enchère : <span className="font-bold text-[#4B2377]">{(currentPrice + increment).toLocaleString('fr-FR')} €</span> (palier de {increment}€)
                  </p>
                  <button
                    onClick={() => handlePlaceBid(currentPrice + increment)}
                    className="w-full px-6 py-4 bg-[#4B2377] hover:bg-purple-700 text-white text-lg font-medium transition-colors"
                  >
                    Enchérir
                  </button>
                </div>

                {!showAutoBid ? (
                  <button
                    onClick={() => setShowAutoBid(true)}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                  >
                    Enchère automatique
                  </button>
                ) : (
                  <div className="space-y-3 p-4 bg-green-50 border border-green-200">
                    <label className="block text-sm font-medium text-neutral-700">
                      Enchère automatique (offre max)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Votre offre maximale"
                        value={autoBidAmount}
                        onChange={(e) => setAutoBidAmount(e.target.value)}
                        className="flex-1 px-4 py-3 border border-neutral-300 focus:border-green-600 focus:outline-none"
                      />
                      <button
                        onClick={() => handlePlaceBid(parseFloat(autoBidAmount || '0'), true)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors whitespace-nowrap"
                      >
                        Valider
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Le système enchérira par paliers de {increment}€ jusqu'à ce montant
                    </p>
                    <button
                      onClick={() => setShowAutoBid(false)}
                      className="w-full px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 border border-neutral-200 space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Prix</p>
                  <p className="text-4xl font-serif text-[#4B2377] font-bold">
                    {object.price.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">Prix fixe</p>
                </div>
                <button
                  onClick={handleQuickBuy}
                  className="w-full px-6 py-4 bg-[#4B2377] hover:bg-purple-700 text-white text-lg font-medium transition-colors"
                >
                  Acheter maintenant
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 border border-neutral-200">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Description</h2>
            <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
              {object.description}
            </p>
          </div>

          <div className="space-y-6">
            {object.dimensions && (
              <div className="bg-white p-6 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">Dimensions</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Longueur</span>
                    <span className="font-medium text-neutral-900">{object.dimensions.length} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Largeur</span>
                    <span className="font-medium text-neutral-900">{object.dimensions.width} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Hauteur</span>
                    <span className="font-medium text-neutral-900">{object.dimensions.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Poids</span>
                    <span className="font-medium text-neutral-900">{object.dimensions.weight} kg</span>
                  </div>
                </div>
              </div>
            )}

            {object.documents && object.documents.length > 0 && (
              <div className="bg-white p-6 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">Documents</h2>
                </div>
                <div className="space-y-2">
                  {object.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4 text-neutral-600" />
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{doc.document.filename}</p>
                        {doc.description && (
                          <p className="text-xs text-neutral-500">{doc.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
