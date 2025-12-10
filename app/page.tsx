import HeroBandeau from "@/app/components/marketing/HeroBandeau";
import HowItWorks from "@/app/components/marketing/HowItWorks";
import TrustStrip from "./components/marketing/TrustStrip";
import CategoriesGrid from "@/app/components/marketing/CategoriesGrid";
import Presentation from "@/app/components/marketing/Presentation";
import Newsletter from "@/app/components/marketing/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Hero introduction */}
        <section className="py-16 md:py-24 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Découvrez l'art des enchères en ligne
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Bienvenue sur Purple Dog, votre plateforme de référence pour les enchères d'objets de collection, d'art et de design. 
            Accédez à des pièces exclusives sélectionnées par nos experts et placez vos enchères en toute confiance.
          </p>
        </section>


        {/* Featured items carousel */}
        <section className="py-12 md:py-16 border-y" style={{ borderColor: "var(--border)" }}>
          <HeroBandeau />
        </section>

        {/* How it works section */}
        <HowItWorks />


        {/* Categories section */}
        <section className="py-12 md:py-16">
          <CategoriesGrid />
        </section>

        {/* About section */}
        <section className="py-14">
          <Presentation />
        </section>

        {/* Trust strip (proofs) - now after Presentation */}
        <section className="py-4">
          <TrustStrip />
        </section>

        {/* Newsletter section */}
        <section className="py-14">
          <Newsletter />
        </section>
      </div>
    </main>
  );
}

