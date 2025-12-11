"use client"; 

import Image from "next/image"; 
import Link from "next/link";
import { useState, useEffect } from "react";
import { createSaleItem, getUserSales } from "@/lib/api";

interface SaleItem {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  offers?: number;
  image: string;
}

export default function DashboardParticulier() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // États pour le modal Avis
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedNPS, setSelectedNPS] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  
  // États pour les objets en vente
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    {
      id: '1',
      title: 'Montre Rolex Submariner',
      price: 8500,
      type: 'Enchère',
      status: 'En cours',
      offers: 3,
      image: 'https://images.unsplash.com/photo-1662384205880-2c7a9879cc0c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: '2',
      title: 'Bague en diamant vintage',
      price: 3200,
      type: 'Vente directe',
      status: 'En cours',
      offers: 1,
      image: 'https://media.istockphoto.com/id/121119171/fr/photo/antique-diamond-bague.webp?a=1&b=1&s=612x612&w=0&k=20&c=JHrjjY2DcPMsx0b4SHDPYwNn0k3omhnGq0SY2W0eNas='
    },
    {
      id: '3',
      title: 'Tableau contemporain signé',
      price: 1500,
      type: 'Enchère',
      status: 'En attente',
      image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=400&fit=crop'
    }
  ]);

  // Charger les données au démarrage
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await getUserSales();
      if (response && response.docs) {
        const formattedItems = response.docs.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          type: item.saleType,
          status: item.status,
          offers: item.offers || 0,
          image: item.image || 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&h=400&fit=crop'
        }));
        setSaleItems(formattedItems);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRating(0);
    setSelectedNPS(0);
    setShowSuccessMessage(null);
  };

  // Gestionnaire pour le formulaire "Vendre un objet"
  const handleSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Sauvegarder en BDD
      const saleData = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        price: parseInt(formData.get('price') as string),
        saleType: formData.get('saleType') as string,
        status: 'En attente'
      };
      
      const response = await createSaleItem(saleData);
      
      // Ajouter à la liste locale
      const newItem: SaleItem = {
        id: response.doc.id,
        title: saleData.title,
        price: saleData.price,
        type: saleData.saleType,
        status: 'En attente',
        image: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&h=400&fit=crop'
      };
      
      setSaleItems([newItem, ...saleItems]);
      setShowSuccessMessage("✅ Votre annonce a été publiée et sauvegardée avec succès!");
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      setShowSuccessMessage("❌ Erreur lors de la publication. Réessayez.");
    }
  };

  // Gestionnaire pour le formulaire "Mon profil"
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuccessMessage("✅ Votre profil a été mis à jour avec succès!");
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  // Gestionnaire pour le formulaire "Donner son avis"
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Particulier</h1>
          <p className="text-gray-600">Gérez vos ventes et votre profil</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Vendre un objet */}
          <button
            onClick={() => setActiveModal('vendre')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/Market.png" alt="Vendre" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vendre un objet</h2>
            <p className="text-gray-600 text-sm mb-4">
              Publiez vos objets de valeur en quelques clics
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
            onClick={() => setActiveModal('objets')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/IconSales.png" alt="Mes objets" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mes objets en vente</h2>
            <p className="text-gray-600 text-sm mb-4">
              Consultez vos annonces et les offres reçues
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Voir mes objets</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Feature 3: Gestion du Profil */}
          <button
            onClick={() => setActiveModal('profil')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full">
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

          {/* Feature 4: Donner son avis */}
          <button
            onClick={() => setActiveModal('avis')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group text-left w-full">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden" 
              style={{ backgroundColor: '#E8E3F0' }}>
              <Image src="/IconRating.png" alt="Avis" width={40} height={40} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Donner votre avis</h2>
            <p className="text-gray-600 text-sm mb-4">
              Partagez votre expérience avec Purple Dog
            </p>
            <div className="flex items-center gap-2 font-medium" style={{ color: '#4A3866' }}>
              <span>Évaluer</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Liste des objets en vente */}
        <div className="mt-12 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes objets en vente</h2>
            <button 
              onClick={() => setActiveModal('vendre')}
              className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#4A3866' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Vendre un objet
            </button>
          </div>

          {saleItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#E8E3F0' }}>
                <svg className="w-10 h-10" style={{ color: '#4A3866' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun objet en vente</h3>
              <p className="text-gray-600 mb-6">Commencez à vendre vos objets de valeur dès maintenant</p>
              <button 
                onClick={() => setActiveModal('vendre')}
                className="px-8 py-3 text-white rounded-lg font-medium hover:opacity-90"
                style={{ backgroundColor: '#4A3866' }}
              >
                Créer ma première annonce
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-xl" style={{ color: '#4A3866' }}>
                      {item.price.toLocaleString()} €
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      item.status === 'En cours' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {item.type}
                    </span>
                  </div>
                  {item.offers && item.offers > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">
                        {item.offers} offre{item.offers > 1 ? 's' : ''} reçue{item.offers > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => setActiveModal('objets')}
                    className="w-full px-4 py-2 border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors" 
                    style={{ borderColor: '#4A3866', color: '#4A3866' }}
                  >
                    Voir les détails
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Vendre un objet */}
      {activeModal === 'vendre' && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Vendre un objet</h2>
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
              <form className="space-y-6" onSubmit={handleSaleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Titre de l'annonce *</label>
                  <input name="title" type="text" placeholder="Ex: Montre Rolex Submariner 1960" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Catégorie *</label>
                  <select name="category" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900">
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="bijoux">Bijoux</option>
                    <option value="montres">Montres</option>
                    <option value="art">Art</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
                  <textarea name="description" rows={4} placeholder="Décrivez votre objet..." required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Prix de départ (€) *</label>
                    <input name="price" type="number" placeholder="1000" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Type de vente *</label>
                    <select name="saleType" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900">
                      <option value="Enchère">Enchère</option>
                      <option value="Vente directe">Vente directe</option>
                    </select>
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
      {activeModal === 'objets' && (
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
              {saleItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun objet en vente pour le moment</p>
                  <button 
                    onClick={() => { closeModal(); setActiveModal('vendre'); }}
                    className="mt-4 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
                    style={{ backgroundColor: '#4A3866' }}
                  >
                    Créer une annonce
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {saleItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                          <Image 
                            src={item.image} 
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            Prix: {item.price.toLocaleString()} € • {item.type}
                          </p>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              item.status === 'En cours' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                            {item.offers && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {item.offers} offre{item.offers > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100" style={{ color: '#4A3866' }}>
                          Voir détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mon profil */}
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
              {showSuccessMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg font-medium">
                  {showSuccessMessage}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleProfileSubmit}>
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Jean Dupont</h3>
                    <p className="text-gray-600 text-sm">jean.dupont@email.com</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Prénom *</label>
                    <input type="text" defaultValue="Jean" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                    <input type="text" defaultValue="Dupont" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                  <input type="email" defaultValue="jean.dupont@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Adresse</label>
                  <input type="text" placeholder="123 Rue de Paris, 75001 Paris" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-gray-700">Recevoir les notifications par email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-gray-700">Notifications des nouvelles offres</span>
                    </label>
                  </div>
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
                  <label className="block text-sm font-medium text-gray-900 mb-3">Évaluation globale * {selectedRating > 0 && `(${selectedRating}/5)`}</label>
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
                  <label className="block text-sm font-medium text-gray-900 mb-3">Note NPS (1-10) * {selectedNPS > 0 && `- Vous avez choisi: ${selectedNPS}`}</label>
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">Commentaires & Suggestions</label>
                  <textarea 
                    rows={5}
                    placeholder="Partagez votre expérience avec Purple Dog..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                  ></textarea>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Points d'amélioration</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Interface utilisateur</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Vitesse de la plateforme</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Service client</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Processus de vente</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90" style={{ backgroundColor: '#4A3866' }}>
                    Envoyer mon avis
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
