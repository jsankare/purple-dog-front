export const metadata = { title: "Qui sommes-nous ? – Purple Dog" };

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <h1 className="h1">Qui sommes-nous ?</h1>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <p>
              Purple Dog, LA plateforme pour vendre mieux vos objets de valeur à des tiers de confiance.
              Nous connectons vendeurs et professionnels qualifiés pour estimer, promouvoir et vendre
              au meilleur prix, en toute transparence.
            </p>
            <ul className="list-disc pl-5 text-muted">
              <li>Experts vérifiés et réseau de confiance</li>
              <li>Données de résultats passés pour éclairer vos choix</li>
              <li>Expérience utilisateur simple et sécurisée</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="h3">Nos valeurs</h2>
            <ul className="mt-4 space-y-2">
              <li>Transparence</li>
              <li>Confiance</li>
              <li>Performance</li>
              <li>Respect des données</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}