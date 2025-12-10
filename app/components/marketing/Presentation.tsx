export default function Presentation() {
  const features = [
    {
      title: "Estimation fiable",
      description: "Nos experts certifiés évaluent chaque pièce avec précision et transparence"
    },
    {
      title: "Réseau de tiers",
      description: "Accédez à un réseau étendu de partenaires de confiance dans toute la France"
    },
    {
      title: "Résultats vérifiés",
      description: "Consultez l'historique de nos ventes pour prendre des décisions éclairées"
    },
    {
      title: "Sécurité totale",
      description: "Transactions sécurisées et assurance complète sur tous les lots"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Main presentation */}
      <div className="space-y-4">
        <h2 className="h2">À propos de Purple Dog</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <p>
            Purple Dog est la plateforme de référence pour vendre et acquérir les objets de valeur 
            dans un environnement de confiance. Nous connectons passionnés, collectionneurs et 
            vendeurs avec des experts certifiés qui garantissent l'authenticité et la qualité 
            de chaque pièce.
          </p>
          <p>
            Que vous cherchiez à vendre des pièces de collection ou à acquérir des trésors uniques, 
            Purple Dog offre une plateforme transparente, sécurisée et optimisée pour les meilleures 
            évaluations et résultats de vente.
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <div key={i} className="rounded-app border-subtle surface p-5 space-y-2">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="rounded-app border-subtle surface-2 p-8 text-center space-y-4">
        <h3 className="text-xl font-semibold">Prêt à commencer ?</h3>
        <p className="text-muted max-w-2xl mx-auto">
          Créez votre compte dès maintenant pour accéder à nos enchères exclusives et 
          bénéficier des avantages réservés aux membres Purple Dog.
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <button className="px-6 py-2.5 rounded-app font-medium transition-colors" 
            style={{ background: "var(--brand)", color: "white" }}>
            S'inscrire
          </button>
          <button className="px-6 py-2.5 rounded-app font-medium border transition-colors"
            style={{ borderColor: "var(--border)" }}>
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
}