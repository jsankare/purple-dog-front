"use client"; 

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ObjectItem {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  currentBid?: number;
  timeLeft?: string;
  icon: string;
}

export default function DashboardProfessionnel() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedNPS, setSelectedNPS] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Liste des objets disponibles à l'achat
  const [availableObjects, setAvailableObjects] = useState<ObjectItem[]>([
    {
      id: '1',
      title: 'Tableau Picasso - Période Bleue',
      price: 250000,
      type: 'Enchère',
      status: 'En vente',
      currentBid: 245000,
      timeLeft: '3j 5h',
      icon: '🎨'
    },
    {
      id: '2',
      title: 'Montre Patek Philippe 1950',
      price: 180000,
      type: 'Vente rapide',
      status: 'En vente',
      icon: '⌚'
    },
    {
      id: '3',
      title: 'Sculpture Bronze Art Déco',
      price: 45000,
      type: 'Enchère',
      status: 'En vente',
      currentBid: 42000,
      timeLeft: '1j 12h',
      icon: '🗿'
    },
    {
      id: '4',
      title: 'Collier Diamants Cartier',
      price: 95000,
      type: 'Vente rapide',
      status: 'En vente',
      icon: '💎'
    },
    {
      id: '5',
      title: 'Vase Ming Dynasty',
      price: 320000,
      type: 'Enchère',
      status: 'En vente',
      currentBid: 310000,
      timeLeft: '5h 23m',
      icon: '🏺'
    },
  ]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRating(0);
    setSelectedNPS(0);
    setShowSuccessMessage(null);
  };

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedRating === 0 || selectedNPS === 0) {
      alert("Veuillez donner une note et un score NPS");
      return;
    }
    setShowSuccessMessage("✅ Merci pour votre avis! Il a été envoyé avec succès.");
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/purple-dog-logo.svg" 
              alt="Purple Dog Logo" 
              width={150} 
              height={70}
              className="h-12 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bonjour, <strong>Entreprise Pro</strong>
            </span>
            <button className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100" style={{ color: '#4A3866' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Professionnel</h1>
          <p className="text-gray-600">Achetez et vendez des objets de valeur</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un objet (nom, description, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="all">Toutes les catégories</option>
                <option value="art">Art & Peintures</option>
                <option value="montres">Montres</option>
                <option value="bijoux">Bijoux</option>
                <option value="sculpture">Sculptures</option>
                <option value="objets">Objets de collection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Type de vente</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="all">Tous les types</option>
                <option value="enchere">Enchères</option>
                <option value="rapide">Vente rapide</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="all">Tous les statuts</option>
                <option value="en-vente">En vente</option>
                <option value="vendu">Plus disponible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Cards - 5 Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Mettre en vente un objet */}
          <button
            onClick={() => setActiveModal('vendre')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/Market.png" alt="Vendre" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mettre en vente un objet</h2>
            <p className="text-gray-600 text-sm mb-4">
              Publiez vos objets avec formulaire détaillé
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Commencer</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Feature 2: Mes objets en vente */}
          <button
            onClick={() => setActiveModal('objets-vente')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/IconSales.png" alt="Mes objets" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mes objets en vente</h2>
            <p className="text-gray-600 text-sm mb-4">
              Gérez vos ventes et consultez les offres
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Voir mes objets</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Feature 3: Favoris/Historique */}
          <button
            onClick={() => setActiveModal('favoris')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <span className="text-2xl">⭐</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Favoris & Historique</h2>
            <p className="text-gray-600 text-sm mb-4">
              Objets likés, enchères et historique d'achats
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Consulter</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Feature 4: Profil */}
          <button
            onClick={() => setActiveModal('profil')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/IconProfile.png" alt="Profil" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mon profil</h2>
            <p className="text-gray-600 text-sm mb-4">
              Gérez vos informations et paramètres
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Modifier</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Feature 5: Donner son avis */}
          <button
            onClick={() => setActiveModal('avis')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/IconRating.png" alt="Avis" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Donner votre avis</h2>
            <p className="text-gray-600 text-sm mb-4">
              Partagez votre expérience sur Purple Dog
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Évaluer</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Liste des objets disponibles */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Objets disponibles à l'achat</h2>
              <p className="text-gray-600 mt-1">{availableObjects.length} objets trouvés</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableObjects.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-6xl">{item.icon}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                
                {item.type === 'Enchère' ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Enchère actuelle</span>
                      <span className="text-sm font-medium text-gray-600">{item.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl" style={{ color: '#4A3866' }}>
                        {item.currentBid?.toLocaleString()} €
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Prix de départ: {item.price.toLocaleString()} €</span>
                  </div>
                ) : (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Prix fixe</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl" style={{ color: '#4A3866' }}>
                        {item.price.toLocaleString()} €
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.status === 'En vente' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    item.type === 'Enchère' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors" 
                    style={{ backgroundColor: '#4A3866' }}
                  >
                    {item.type === 'Enchère' ? 'Enchérir' : 'Acheter'}
                  </button>
                  <button 
                    className="px-4 py-2 border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors" 
                    style={{ borderColor: '#4A3866', color: '#4A3866' }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Donner son avis */}
      {activeModal === 'avis' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Donner votre avis</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {showSuccessMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg font-medium">
                  {showSuccessMessage}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleReviewSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Évaluation globale * {selectedRating > 0 && `(${selectedRating}/5)`}
                  </label>
                  <div className="flex gap-2 text-4xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setSelectedRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        {star <= selectedRating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Note NPS (1-10) * {selectedNPS > 0 && `- Vous avez choisi: ${selectedNPS}`}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedNPS(num)}
                        className={`w-12 h-12 border-2 rounded-lg font-medium transition-all ${
                          selectedNPS === num ? 'scale-110' : ''
                        }`}
                        style={{ 
                          borderColor: '#4A3866', 
                          backgroundColor: selectedNPS === num ? '#4A3866' : 'white',
                          color: selectedNPS === num ? 'white' : '#4A3866'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    1-6: Détracteurs • 7-8: Passifs • 9-10: Promoteurs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Commentaires & Suggestions
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Partagez votre expérience avec Purple Dog..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90" 
                    style={{ backgroundColor: '#4A3866' }}
                  >
                    Envoyer mon avis
                  </button>
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-6 py-3 border-2 rounded-lg font-medium" 
                    style={{ borderColor: '#4A3866', color: '#4A3866' }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mettre en vente */}
      {activeModal === 'vendre' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mettre en vente un objet</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Nom de l'objet *</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Ex: Montre Rolex Submariner" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Catégorie *</label>
                    <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900">
                      <option value="">Sélectionnez</option>
                      <option>Peinture</option>
                      <option>Sculpture</option>
                      <option>Montre</option>
                      <option>Bijoux</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Dimensions (cm) *</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Ex: 50x70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Poids (kg) *</label>
                    <input type="number" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Ex: 2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Prix souhaité (€) *</label>
                    <input type="number" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Ex: 5000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
                  <textarea rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Description détaillée de l'objet..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Type de vente *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="saleType" value="enchere" className="mr-2" />
                      <span className="text-gray-700">Enchères</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="saleType" value="rapide" className="mr-2" />
                      <span className="text-gray-700">Vente rapide</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90" style={{ backgroundColor: '#4A3866' }}>
                    Publier l'annonce
                  </button>
                  <button type="button" onClick={closeModal} className="px-6 py-3 border-2 rounded-lg font-medium" style={{ borderColor: '#4A3866', color: '#4A3866' }}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mes objets en vente */}
      {activeModal === 'objets-vente' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes objets en vente</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">🖼️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">Tableau Moderne Abstrait</h3>
                        <p className="text-sm text-gray-600">Prix: 12 000 € • Enchère</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">En cours</span>
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">2 offres</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100" style={{ color: '#4A3866' }}>
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Favoris & Historique */}
      {activeModal === 'favoris' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Favoris & Historique</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium">Favoris</button>
                <button className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Mes enchères</button>
                <button className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">Historique</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableObjects.slice(0, 3).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                    <p className="text-sm font-bold" style={{ color: '#4A3866' }}>{item.price.toLocaleString()} €</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Profil */}
      {activeModal === 'profil' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Entreprise Pro</h3>
                    <p className="text-gray-600 text-sm">entreprise@pro.com</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Nom de l'entreprise *</label>
                    <input type="text" defaultValue="Entreprise Pro" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">SIRET *</label>
                    <input type="text" defaultValue="123 456 789 00010" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                  <input type="email" defaultValue="entreprise@pro.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                  <input type="tel" placeholder="+33 1 23 45 67 89" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90" style={{ backgroundColor: '#4A3866' }}>
                    Enregistrer
                  </button>
                  <button type="button" onClick={closeModal} className="px-6 py-3 border-2 rounded-lg font-medium" style={{ borderColor: '#4A3866', color: '#4A3866' }}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
