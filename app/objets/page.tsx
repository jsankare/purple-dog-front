"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Object {
  id: string;
  name: string;
  category: string;
  price: number;
  saleMode: string;
  photos?: Array<{ photo: { url: string } }>;
  status: string;
  auctionConfig?: {
    currentBid?: number;
    bidCount?: number;
    endDate?: string;
  };
}

function PhotoCarousel({ photos }: { photos: Array<{ photo: { url: string } }> }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400">
        Pas d'image
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={photos[currentIndex]?.photo?.url}
        alt={`Photo ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-neutral-800" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
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

      if (days > 0) {
        setTimeLeft(`${days}j ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1 text-xs text-neutral-600">
      <Clock className="w-3 h-3" />
      <span>{timeLeft}</span>
    </div>
  );
}

export default function ObjectsPage() {
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSaleMode, setSelectedSaleMode] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [timeFilter, setTimeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});
  const [showBidInput, setShowBidInput] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleQuickBuy = async (e: React.MouseEvent, objectId: string, price: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Confirmer l'achat pour ${price.toLocaleString('fr-FR')} € ?`)) {
      return;
    }

    try {
      // TODO: Implémenter l'appel API pour l'achat
      alert('Achat en cours... (API à implémenter)');
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert('Erreur lors de l\'achat');
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

  const handlePlaceBid = async (e: React.MouseEvent, objectId: string, bidValue: number, isAutoBid: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bidValue <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    try {
      // TODO: Implémenter l'appel API pour enchérir
      const bidType = isAutoBid ? 'automatique' : 'manuelle';
      alert(`Enchère ${bidType} de ${bidValue.toLocaleString('fr-FR')} € placée ! (API à implémenter)`);
      setBidAmount({ ...bidAmount, [objectId]: '' });
      setShowBidInput({ ...showBidInput, [objectId]: false });
    } catch (error) {
      console.error('Erreur lors de l\'enchère:', error);
      alert('Erreur lors de l\'enchère');
    }
  };

  const handleQuickBid = (e: React.MouseEvent, objectId: string, amount: number) => {
    handlePlaceBid(e, objectId, amount, false);
  };

  const toggleBidInput = (e: React.MouseEvent, objectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBidInput({ ...showBidInput, [objectId]: !showBidInput[objectId] });
  };

  const fetchObjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/objects?where[status][equals]=active&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Objets chargés:', data);
      setObjects(data.docs || []);
    } catch (error) {
      console.error('Erreur lors du chargement des objets:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
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

  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || obj.category === selectedCategory;
    const matchesSaleMode = selectedSaleMode === 'all' || obj.saleMode === selectedSaleMode;
    
    let matchesPrice = true;
    const currentPrice = obj.saleMode === 'auction' && obj.auctionConfig?.currentBid 
      ? obj.auctionConfig.currentBid 
      : obj.price;
    
    if (priceRange.min && currentPrice < parseFloat(priceRange.min)) {
      matchesPrice = false;
    }
    if (priceRange.max && currentPrice > parseFloat(priceRange.max)) {
      matchesPrice = false;
    }
    
    let matchesTime = true;
    if (timeFilter !== 'all' && obj.saleMode === 'auction' && obj.auctionConfig?.endDate) {
      const now = new Date().getTime();
      const end = new Date(obj.auctionConfig.endDate).getTime();
      const hoursLeft = (end - now) / (1000 * 60 * 60);
      
      switch(timeFilter) {
        case 'ending-soon':
          matchesTime = hoursLeft > 0 && hoursLeft <= 24;
          break;
        case '1-3-days':
          matchesTime = hoursLeft > 24 && hoursLeft <= 72;
          break;
        case '3-7-days':
          matchesTime = hoursLeft > 72 && hoursLeft <= 168;
          break;
        case 'more-7-days':
          matchesTime = hoursLeft > 168;
          break;
      }
    } else if (timeFilter !== 'all' && obj.saleMode !== 'auction') {
      matchesTime = false; 
    }
    
    return matchesSearch && matchesCategory && matchesSaleMode && matchesPrice && matchesTime;
  });

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-7xl mx-auto">
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
            Objets en vente
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-4"></div>
          <p className="text-neutral-600">
            Découvrez notre sélection d'objets de valeur et d'exception
          </p>
        </div>

        <div className="bg-white border border-neutral-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un objet..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto px-6 py-3 border border-neutral-300 hover:border-[#4B2377] transition-colors flex items-center gap-2 justify-center bg-white"
            >
              <SlidersHorizontal className="w-5 h-5 text-neutral-600" />
              <span>Filtres</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors bg-white text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Mode de vente
                </label>
                <select
                  value={selectedSaleMode}
                  onChange={(e) => setSelectedSaleMode(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors bg-white text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="auction">Enchères</option>
                  <option value="quick-sale">Vente rapide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Prix (€)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Temps restant
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 focus:border-[#4B2377] focus:outline-none transition-colors bg-white text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="ending-soon">Se termine bientôt (&lt; 24h)</option>
                  <option value="1-3-days">1 à 3 jours</option>
                  <option value="3-7-days">3 à 7 jours</option>
                  <option value="more-7-days">Plus de 7 jours</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              {filteredObjects.length} objet{filteredObjects.length > 1 ? 's' : ''} trouvé{filteredObjects.length > 1 ? 's' : ''}
            </div>
            
            {(searchQuery || selectedCategory !== 'all' || selectedSaleMode !== 'all' || priceRange.min || priceRange.max || timeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSaleMode('all');
                  setPriceRange({ min: '', max: '' });
                  setTimeFilter('all');
                }}
                className="text-sm text-[#4B2377] hover:text-purple-700 font-medium"
              >
                Réinitialiser tous les filtres
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-[#4B2377] rounded-full animate-spin"></div>
            <p className="mt-4 text-neutral-600">Chargement des objets...</p>
          </div>
        )}

        {!loading && filteredObjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredObjects.map((obj) => (
              <Link
                key={obj.id}
                href={`/objets/${obj.id}`}
                className="bg-white border border-neutral-200 hover:border-[#4B2377] transition-all hover:shadow-md group flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                  <PhotoCarousel photos={obj.photos || []} />
                  
                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-block px-2 py-1 text-xs bg-white/95 text-[#4B2377] font-medium shadow-sm">
                      {obj.saleMode === 'auction' ? 'Enchères' : 'Vente rapide'}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-[#4B2377] transition-colors line-clamp-2">
                    {obj.name}
                  </h3>
                  
                  <p className="text-xs text-neutral-500 mb-2 line-clamp-1">
                    {categories.find(c => c.value === obj.category)?.label || obj.category}
                  </p>

                  <div className="mt-auto">
                    {obj.saleMode === 'auction' && obj.auctionConfig ? (
                      <div>
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-lg font-serif text-[#4B2377] font-bold">
                            {obj.auctionConfig.currentBid ? 
                              `${obj.auctionConfig.currentBid.toLocaleString('fr-FR')} €` : 
                              `${(obj.price * 0.9).toLocaleString('fr-FR')} €`}
                          </p>
                          {obj.auctionConfig.bidCount !== undefined && obj.auctionConfig.bidCount > 0 && (
                            <span className="text-xs text-neutral-500">
                              {obj.auctionConfig.bidCount} enchère{obj.auctionConfig.bidCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        {obj.auctionConfig.endDate && (
                          <div className="flex items-center justify-between pt-2 pb-2 border-t border-neutral-100">
                            <span className="text-xs text-neutral-500">Fin dans:</span>
                            <CountdownTimer endDate={obj.auctionConfig.endDate} />
                          </div>
                        )}

                        <div className="mt-2 space-y-2">
                          {(() => {
                            const currentPrice = obj.auctionConfig.currentBid || obj.price * 0.9;
                            const increment = getBidIncrement(currentPrice);
                            const nextBid = currentPrice + increment;
                            
                            return (
                              <button
                                onClick={(e) => handleQuickBid(e, obj.id, nextBid)}
                                className="w-full px-3 py-2 bg-[#4B2377] hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                              >
                                Enchérir {nextBid.toLocaleString('fr-FR')} €
                              </button>
                            );
                          })()}
                          
                          {!showBidInput[obj.id] ? (
                            <button
                              onClick={(e) => toggleBidInput(e, obj.id)}
                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                            >
                              Enchère automatique
                            </button>
                          ) : (
                            <div 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }} 
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="space-y-2 p-2 bg-green-50 border border-green-200"
                            >
                              <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">
                                  Offre max
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    placeholder="€"
                                    value={bidAmount[`${obj.id}_auto`] || ''}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      setBidAmount({ ...bidAmount, [`${obj.id}_auto`]: e.target.value });
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                    }}
                                    onFocus={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className="flex-1 px-3 py-2 border border-neutral-300 focus:border-green-600 focus:outline-none text-sm"
                                  />
                                  <button
                                    onClick={(e) => handlePlaceBid(e, obj.id, parseFloat(bidAmount[`${obj.id}_auto`] || '0'), true)}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors whitespace-nowrap"
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={(e) => toggleBidInput(e, obj.id)}
                                className="w-full px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-medium transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-serif text-[#4B2377] font-bold mb-2">
                          {obj.price.toLocaleString('fr-FR')} €
                        </p>
                        <button
                          onClick={(e) => handleQuickBuy(e, obj.id, obj.price)}
                          className="w-full px-3 py-2 bg-[#4B2377] hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                        >
                          Acheter maintenant
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredObjects.length === 0 && (
          <div className="bg-white border border-neutral-200 p-12 text-center">
            <p className="text-neutral-600 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Aucun objet ne correspond à votre recherche' 
                : 'Aucun objet en vente pour le moment'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-[#4B2377] hover:text-purple-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
