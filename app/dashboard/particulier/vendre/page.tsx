import Image from "next/image";
import Link from "next/link";  

export default function VendreObjet() {
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
            <Link href="/dashboard/particulier" className="text-sm hover:underline" style={{ color: '#4A3866' }}>
              ← Retour au dashboard
            </Link>
            <span className="text-sm text-gray-600">Bonjour, <strong>Jean Dupont</strong></span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendre un objet</h1>
          <p className="text-gray-600">Remplissez le formulaire pour mettre en vente votre objet de valeur</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Titre de l'annonce *
              </label>
              <input 
                type="text"
                placeholder="Ex: Montre Rolex Submariner 1960"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Catégorie *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option value="">Sélectionnez une catégorie</option>
                <option value="bijoux">Bijoux</option>
                <option value="montres">Montres</option>
                <option value="art">Art</option>
                <option value="objets-collection">Objets de collection</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea 
                rows={5}
                placeholder="Décrivez votre objet en détail (état, provenance, authenticité...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Prix et Type de vente */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prix de départ (€) *
                </label>
                <input 
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Type de vente *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                  <option value="enchere">Enchère</option>
                  <option value="vente-directe">Vente directe</option>
                </select>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Photos *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 mb-2">Cliquez pour ajouter des photos</p>
                  <p className="text-sm text-gray-500">PNG, JPG jusqu'à 10MB (5 photos max)</p>
                </div>
              </div>
            </div>

            {/* État */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                État de l'objet *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="etat" value="neuf" className="mr-2" />
                  <span className="text-gray-700">Neuf</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="etat" value="excellent" className="mr-2" />
                  <span className="text-gray-700">Excellent</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="etat" value="bon" className="mr-2" />
                  <span className="text-gray-700">Bon</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="etat" value="usage" className="mr-2" />
                  <span className="text-gray-700">Usagé</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#4A3866' }}
              >
                Publier l'annonce
              </button>
              <Link 
                href="/dashboard/particulier"
                className="px-6 py-3 border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#4A3866', color: '#4A3866' }}
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
