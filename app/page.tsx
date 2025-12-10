import Image from "next/image"; 
import HeroBandeau from "@/app/components/marketing/HeroBandeau";
import CategoriesGrid from "@/app/components/marketing/CategoriesGrid";
import Presentation from "@/app/components/marketing/Presentation";
import Newsletter from "@/app/components/marketing/Newsletter";
import Image from "next/image"; 

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-6xl px-4">
        <section className="py-12">
          <HeroBandeau />
        </section>
        <section className="py-12">
          <CategoriesGrid />
        </section>
        <section className="py-14">
          <Presentation />
        </section>
        <section className="py-14">
          <Newsletter />
        </section>
      </div>
    </main>
  );
}

