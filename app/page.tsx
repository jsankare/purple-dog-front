import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Bandeau hero */}
        <section className="py-10">
          <HeroBandeau />
        </section>

        {/* Catégories 5x2 */}
        <section className="py-10">
          <CategoriesGrid />
        </section>

        {/* Présentation Purple Dog */}
        <section className="py-14">
          <Presentation />
        </section>

        {/* Newsletter */}
        <section className="py-14">
          <Newsletter />
        </section>
      </div>
    </main>
  );
}

// Imports locaux – à placer en haut du fichier
import HeroBandeau from "@/app/components/marketing/HeroBandeau";
import CategoriesGrid from "@/app/components/marketing/CategoriesGrid";
import Presentation from "@/app/components/marketing/Presentation";
import Newsletter from "@/app/components/marketing/Newsletter";