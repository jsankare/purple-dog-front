"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  { src: "/objects/obj1.jpg", alt: "Objet 1" },
  { src: "/objects/obj2.jpg", alt: "Objet 2" },
  { src: "/objects/obj3.jpg", alt: "Objet 3" },
  { src: "/objects/obj4.jpg", alt: "Objet 4" },
  { src: "/objects/obj5.jpg", alt: "Objet 5" },
];

const descriptifs = [
  { title: "Montre de collection", price: "24 500 €", result: "Adjugée à 26 000 €" },
  { title: "Sac vintage", price: "3 200 €", result: "Adjugé à 3 600 €" },
  { title: "Tableau moderne", price: "12 000 €", result: "Adjugé à 14 200 €" },
  { title: "Bijou ancien", price: "7 800 €", result: "Adjugé à 8 300 €" },
  { title: "Objet design", price: "1 200 €", result: "Adjugé à 1 450 €" },
];

export default function HeroBandeau() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);

    setIndex((prev) => {
      const len = images.length;
      return ((next % len) + len) % len;
    });

    setTimeout(() => setAnimating(false), 450);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index]);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onMouseEnter = () => stopAuto();
  const onMouseLeave = () => startAuto();

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopAuto();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }

    touchStartX.current = null;
    startAuto();
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
      
      {/* CARROUSEL */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-(--border) bg-gray-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-video">
          <div
            className="absolute inset-0 flex"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: animating ? "transform 450ms ease" : "none",
            }}
          >
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video w-full shrink-0">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover transition-opacity duration-500 ${
                    i === index ? "opacity-100" : "opacity-80"
                  }`}
                  priority={i === index}
                />
              </div>
            ))}
          </div>

          {/* INDICATEURS */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à l’image ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                  i === index
                    ? "bg-(--brand) border-(--brand)"
                    : "bg-white/80 border-black/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">Objets en vedette</h2>
          <p className="mt-2 text-(--muted)">
            Découvrez des objets de valeur et leurs résultats de vente passés.
          </p>
        </div>

        <div className="rounded-lg border border-(--border) bg-(--surface)">
          <ul className="divide-y divide-(--border)">
            {descriptifs.map((d, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-4 py-3 transition-colors ${
                  i === index ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="text-sm text-(--muted)">
                    Estimation: {d.price}
                  </div>
                </div>
                <div className="text-sm font-medium">Résultat: {d.result}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-md border border-(--border) px-3 py-2 text-sm hover:bg-gray-50"
            onClick={prev}
          >
            Précédent
          </button>
          <button
            className="rounded-md bg-(--brand) px-3 py-2 text-sm font-medium text-white hover:bg-(--brand-600)"
            onClick={next}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
