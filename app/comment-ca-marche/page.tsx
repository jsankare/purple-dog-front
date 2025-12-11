
export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-[#F9F3FF]">
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <section className="bg-white border border-neutral-200 rounded-lg p-8 lg:p-16 shadow-sm">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-serif text-neutral-900 mb-6">Comment ça marche ?</h1>
            <div className="w-24 h-px bg-[#4B2377] mx-auto mb-8"></div>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              Découvrez comment utiliser Purple Dog pour vendre ou acheter des objets de valeur en toute confiance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-semibold text-[#4B2377] mb-2 text-xl">1. Inscription</h2>
              <p className="text-neutral-600">Créez un compte gratuitement pour accéder à toutes les fonctionnalités de la plateforme.</p>
            </div>
            <div>
              <h2 className="font-semibold text-[#4B2377] mb-2 text-xl">2. Déposez vos objets</h2>
              <p className="text-neutral-600">Ajoutez facilement vos objets à vendre ou à acheter via le formulaire dédié.</p>
            </div>
            <div>
              <h2 className="font-semibold text-[#4B2377] mb-2 text-xl">3. Recevez des offres</h2>
              <p className="text-neutral-600">Recevez des offres d'autres utilisateurs et gérez vos transactions en toute sécurité.</p>
            </div>
            <div>
              <h2 className="font-semibold text-[#4B2377] mb-2 text-xl">4. Finalisez la transaction</h2>
              <p className="text-neutral-600">Finalisez la vente ou l'achat et laissez un avis pour améliorer la communauté.</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#4B2377] mb-2">Besoin d'aide ?</h2>
            <p className="text-neutral-600">Consultez notre FAQ ou contactez le support pour toute question.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
