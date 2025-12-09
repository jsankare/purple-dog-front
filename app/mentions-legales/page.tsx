export const metadata = { title: "Mentions légales – Purple Dog" };

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="h1">Mentions légales</h1>

        <div className="mt-6 space-y-6">
          <section className="card">
            <h2 className="h3">Éditeur du site</h2>
            <p className="mt-2">
              Purple Dog, Société …<br />
              Adresse …<br />
              Email : contact@purpledog.example
            </p>
          </section>

          <section className="card">
            <h2 className="h3">Hébergement</h2>
            <p className="mt-2">
              Hébergeur : …<br />
              Adresse : …
            </p>
          </section>

          <section className="card">
            <h2 className="h3">Propriété intellectuelle</h2>
            <p className="mt-2">
              Les contenus de ce site sont protégés par le droit d’auteur. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section className="card">
            <h2 className="h3">Données personnelles</h2>
            <p className="mt-2">
              Pour toute information, contactez-nous à l’adresse ci-dessus. Consultez également notre politique RGPD.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}