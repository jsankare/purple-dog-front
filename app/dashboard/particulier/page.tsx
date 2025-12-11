"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Package, User, Star, Eye, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface SaleItem {
  id: string;
  name: string;
  price: number;
  saleMode: string;
  status: string;
  auctionConfig?: {
    bidCount?: number;
    endDate?: string;
  };
  photos?: Array<{ photo: { url: string } }>;
  views?: number;
}

export default function DashboardParticulier() {
  const router = useRouter();
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // D'abord, récupérer l'utilisateur connecté
      const userResponse = await fetch(`${API_URL}/api/profile`, {
        credentials: 'include',
      });
      
      if (!userResponse.ok) {
        console.error('Utilisateur non connecté');
        router.push('/login');
        return;
      }
      
      const userData = await userResponse.json();
      console.log('Données utilisateur:', userData);
      
      // Vérifier le rôle de l'utilisateur
      const userRole = userData.profile?.role || userData.user?.role || userData.role;
      
      // Dashboard particulier accessible uniquement par "particulier" ou "admin"
      if (userRole !== 'particulier' && userRole !== 'admin') {
        console.error('Accès refusé. Rôle requis: particulier ou admin. Rôle actuel:', userRole);
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      // L'API retourne { success: true, profile: { id, email, ... } }
      const userId = userData.profile?.id || userData.user?.id || userData.id;
      
      if (!userId) {
        console.error('ID utilisateur introuvable. Structure de la réponse:', userData);
        setLoading(false);
        return;
      }
      
      console.log('ID utilisateur trouvé:', userId);
      
      // Charger uniquement les objets de l'utilisateur connecté
      const response = await fetch(
        `${API_URL}/api/objects?where[seller][equals]=${userId}&limit=100`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`${data.docs?.length || 0} objets chargés`);
        setSaleItems(data.docs || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'sold': return 'bg-blue-100 text-blue-700';
      case 'withdrawn': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'sold': return 'Vendu';
      case 'withdrawn': return 'Retiré';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  // Écran d'accès refusé
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#F9F3FF] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-serif text-neutral-900 mb-2">
            Accès refusé
          </h1>
          <p className="text-neutral-600 mb-6">
            Vous n'avez pas les droits nécessaires pour accéder au dashboard particulier.
            <br />
            Seuls les particuliers et administrateurs peuvent y accéder.
          </p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-[#4B2377] hover:bg-purple-700 text-white font-medium rounded transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/dashboard/professionnel"
              className="flex-1 px-6 py-3 border-2 border-[#4B2377] text-[#4B2377] font-medium rounded hover:bg-purple-50 transition-colors"
            >
              Dashboard Pro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#4B2377] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-900 mb-2">
            Mon Dashboard
          </h1>
          <div className="w-24 h-px bg-[#4B2377] mb-4"></div>
          <p className="text-neutral-600">
            Gérez vos objets en vente et votre profil
          </p>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Vendre un objet */}
          <Link
            href="/vendre"
            className="bg-white border border-neutral-200 hover:border-[#4B2377] p-6 transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-[#4B2377] transition-colors">
                <Plus className="w-6 h-6 text-[#4B2377] group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Vendre</h3>
                <p className="text-sm text-neutral-500">Nouveau objet</p>
              </div>
            </div>
            <div className="flex items-center text-[#4B2377] text-sm font-medium">
              <span>Publier</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
 
          {/* Mes objets */} 
          <div className="bg-white border border-neutral-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-[#4B2377]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Mes objets</h3>
                <p className="text-sm text-neutral-500">{saleItems.length} en vente</p>
              </div>
            </div>
          </div>

          {/* Mon profil */}
          <Link
            href="/profile"
            className="bg-white border border-neutral-200 hover:border-[#4B2377] p-6 transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-[#4B2377] transition-colors">
                <User className="w-6 h-6 text-[#4B2377] group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Profil</h3>
                <p className="text-sm text-neutral-500">Paramètres</p>
              </div>
            </div>
            <div className="flex items-center text-[#4B2377] text-sm font-medium">
              <span>Modifier</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Donner son avis */}
          <Link
            href="/feedback"
            className="bg-white border border-neutral-200 hover:border-[#4B2377] p-6 transition-all hover:shadow-md group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-[#4B2377] transition-colors">
                <Star className="w-6 h-6 text-[#4B2377] group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Avis</h3>
                <p className="text-sm text-neutral-500">Donner mon avis</p>
              </div>
            </div>
            <div className="flex items-center text-[#4B2377] text-sm font-medium">
              <span>Évaluer</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>

        {/* Section Mes objets en vente */}
        <div className="bg-white border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif text-neutral-900 mb-1">
                Mes objets en vente
              </h2>
              <div className="w-16 h-px bg-[#4B2377]"></div>
            </div>
            <Link
              href="/vendre"
              className="px-4 py-2 bg-[#4B2377] hover:bg-purple-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-[#4B2377] rounded-full animate-spin"></div>
              <p className="mt-4 text-neutral-600">Chargement...</p>
            </div>
          ) : saleItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-[#4B2377]" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Aucun objet en vente
              </h3>
              <p className="text-neutral-600 mb-6">
                Commencez à vendre vos objets de valeur dès maintenant
              </p>
              <Link
                href="/vendre"
                className="inline-block px-6 py-3 bg-[#4B2377] hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Vendre mon premier objet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {saleItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/particulier/modifier/${item.id}`}
                  className={`bg-neutral-50 border border-neutral-200 hover:border-[#4B2377] transition-all hover:shadow-md group ${
                    item.status === 'sold' ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                    {item.photos && item.photos.length > 0 ? (
                      <img
                        src={item.photos[0].photo.url}
                        alt={item.name}
                        className={`w-full h-full object-cover ${
                          item.status === 'sold' ? 'grayscale' : ''
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
                      {/* Badge mode de vente */}
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        item.saleMode === 'auction' 
                          ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {item.saleMode === 'auction' ? 'Enchère' : 'Vente directe'}
                      </span>
                      
                      {/* Badge statut */}
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-[#4B2377] transition-colors">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="text-lg font-serif text-[#4B2377] font-bold">
                        {item.price.toLocaleString('fr-FR')} €
                      </p>
                    </div>

                    <div className="text-xs text-neutral-500 space-y-1">
                      {item.saleMode === 'auction' && item.auctionConfig?.bidCount !== undefined && item.auctionConfig.bidCount > 0 && (
                        <p>{item.auctionConfig.bidCount} enchère{item.auctionConfig.bidCount > 1 ? 's' : ''}</p>
                      )}
                      {item.views !== undefined && item.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.views} vues</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
