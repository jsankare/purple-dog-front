"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const objects = [
  {
    id: 1,
    title: "Vase Ming Dynasty",
    description: "Vase chinois ancien de la dynastie Ming, porcelaine bleue et blanche exceptionnelle",
    price: "15 000 €",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=800&fit=crop"
  },
  {
    id: 2,
    title: "Montre Patek Philippe",
    description: "Montre de collection Patek Philippe Nautilus en or rose, état neuf avec certificat",
    price: "85 000 €",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop"
  },
  {
    id: 3,
    title: "Tableau Impressionniste",
    description: "Huile sur toile impressionniste française du XIXe siècle, signée et authentifiée",
    price: "42 000 €",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop"
  },
  {
    id: 4,
    title: "Violon Stradivarius",
    description: "Violon italien d'exception avec certificat d'authenticité, son remarquable",
    price: "120 000 €",
    image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&h=800&fit=crop"
  },
  {
    id: 5,
    title: "Sac Hermès Birkin",
    description: "Sac Hermès Birkin 35 en cuir Togo noir, parfait état avec boîte d'origine",
    price: "28 000 €",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop"
  }
];

export default function HeroBandeau() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % objects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + objects.length) % objects.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % objects.length);
  };

  const currentObject = objects[currentIndex];

  return (
    <section className="bg-[#1A1A1A] border border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[400px] lg:h-[500px] bg-neutral-900">
          <img
            src={currentObject.image}
            alt={currentObject.title}
            className="w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors rounded-full backdrop-blur-sm"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors rounded-full backdrop-blur-sm"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {objects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 transition-all rounded-full ${
                  index === currentIndex
                    ? "bg-[#6d28d9] w-8"
                    : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Aller à l'objet ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-[#a78bfa] mb-2 block">
              Objet d'exception
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4">
              {currentObject.title}
            </h2>
            <div className="w-16 h-px bg-[#6d28d9] mb-6"></div>
          </div>

          <p className="text-neutral-300 leading-relaxed mb-8">
            {currentObject.description}
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-xs uppercase tracking-wider text-neutral-400">
              Prix de départ
            </span>
            <span className="text-3xl font-serif text-[#a78bfa]">
              {currentObject.price}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/encheres/${currentObject.id}`}
              className="px-6 py-3 bg-[#6d28d9] text-white hover:bg-[#5b21b6] transition-colors text-center font-medium rounded"
            >
              Voir l'enchère
            </Link>
            <Link
              href="/encheres"
              className="px-6 py-3 border border-neutral-700 text-neutral-300 hover:border-[#6d28d9] hover:text-[#a78bfa] transition-colors text-center font-medium rounded"
            >
              Toutes les enchères
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
