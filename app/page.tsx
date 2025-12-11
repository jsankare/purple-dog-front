import HeroBandeau from "@/app/components/marketing/HeroBandeau";
import CategoriesGrid from "@/app/components/marketing/CategoriesGrid";
import Presentation from "@/app/components/marketing/Presentation";
import Newsletter from "@/app/components/marketing/Newsletter"; 

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F3FF]">
      <div className="mx-auto w-full max-w-7xl px-4">
        <section className="py-12">
          <HeroBandeau />
        </section>

        <section className="py-12">
          <CategoriesGrid />
        </section>

        <section className="py-12">
          <Presentation />
        </section>

        <section className="py-12">
          <Newsletter />
        </section>
      </div>
    </main>
  );
}
