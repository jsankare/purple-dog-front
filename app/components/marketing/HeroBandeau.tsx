"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  { src: "/objects/montres.jpg", alt: "Montre de collection" },
  { src: "/objects/obj2.jpg", alt: "Sac vintage" },
  { src: "/objects/obj3.jpg", alt: "Tableau moderne" },
  { src: "/objects/obj4.jpg", alt: "Bijou ancien" },
  { src: "/objects/obj5.jpg", alt: "Objet design" },
];

const descriptifs = [
  { 
    title: "Montre de collection", 
    price: "24 500 €", 
    result: "Adjugée à 26 000 €",
    description: "Pièce horlogère rare avec mécanisme suisse original"
  },
  { 
    title: "Sac vintage", 
    price: "3 200 €", 
    result: "Adjugé à 3 600 €",
    description: "Cuir authentique d'époque avec patine naturelle"
  },
  { 
    title: "Tableau moderne", 
    price: "12 000 €", 
    result: "Adjugé à 14 200 €",
    description: "Œuvre signée avec provenance documentée"
  },
  { 
    title: "Bijou ancien", 
    price: "7 800 €", 
    result: "Adjugé à 8 300 €",
    description: "Or 18 carats avec pierres précieuses authentifiées"
  },
  { 
    title: "Objet design", 
    price: "1 200 €", 
    result: "Adjugé à 1 450 €",
    description: "Pièce icône du design minimaliste contemporain"
  },
];

export default function HeroBandeau() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const len = images.length;
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    const n = ((next % len) + len) % len;
    setIndex(n);
    window.setTimeout(() => setAnimating(false), 500);
  };

  const next = () => goTo(indexRef.current + 1);
  const prev = () => goTo(indexRef.current - 1);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      goTo(indexRef.current + 1);
    }, 5000);
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-12">
      {/* Carrousel amélioré */}
      <div
        className="relative w-full overflow-hidden rounded-app border-subtle surface-2 shadow-sm"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label="Carrousel d'objets en vedette"
      >
        <div className="relative aspect-square">
          {/* Slides superposées */}
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: i === index ? 1 : 0,
                transition: "opacity 500ms ease-in-out",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={i === index}
              />
            </div>
          ))}

          {/* Overlay gradient léger */}
          <div 
            className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent pointer-events-none"
          />
          {/* Flèches avec meilleure visibilité */}
          <button
            type="button"
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 transition-all hover:bg-white/25 active:bg-white/35"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <ChevronLeftBlack />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 transition-all hover:bg-white/25 active:bg-white/35"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <ChevronRightBlack />
          </button>

          {/* Indicateurs de pagination animés */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à l'image ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === index ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === index ? "white" : "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  opacity: i === index ? 1 : 0.6,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Compteur d'images */}
          <div 
            className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          >
            {index + 1} / {len}
          </div>
        </div>
      </div>

      {/* Section description améliorée */}
      <div className="space-y-6">
        {/* Header avec texte descriptif */}
        <div className="space-y-3">
          <h2 className="h2">Objets en vedette</h2>
          <p className="text-base text-muted leading-relaxed">
            Découvrez nos sélections des objets les plus remarquables de nos ventes récentes. 
            Chaque pièce a été soigneusement authentifiée et estimée par nos experts avant d'être 
            proposée à nos enchérisseurs. Les résultats affichés témoignent du succès de ces ventes exceptionnelles.
          </p>
        </div>

        {/* Liste des descriptions avec meilleure UX */}
        <div className="rounded-app border-subtle surface overflow-hidden">
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {descriptifs.map((d, i) => {
              const active = i === index;
              return (
                <li
                  key={i}
                  className="px-4 py-4 cursor-pointer transition-all duration-300"
                  onClick={() => goTo(i)}
                  style={{
                    background: active ? "var(--surface-2)" : "var(--surface)",
                    borderLeft: active ? "4px solid var(--brand)" : "4px solid transparent",
                  }}
                >
                  {/* Titre et prix */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold leading-tight"
                        style={{
                          fontSize: active ? "1rem" : "0.95rem",
                          fontWeight: active ? 700 : 600,
                          transition: "font-weight .25s ease, font-size .25s ease",
                        }}
                      >
                        {d.title}
                      </h3>
                      {/* Description supplémentaire pour pièces actives */}
                      {active && (
                        <p 
                          className="text-sm mt-2 text-muted"
                          style={{
                            animation: "fadeIn 300ms ease-out",
                          }}
                        >
                          {d.description}
                        </p>
                      )}
                    </div>
                    <div 
                      className="text-sm font-semibold whitespace-nowrap shrink-0"
                      style={{
                        color: active ? "var(--brand)" : "var(--text)",
                        transition: "color .25s ease",
                      }}
                    >
                      {d.result}
                    </div>
                  </div>
                  
                  {/* Prix de départ */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted uppercase tracking-wide">
                      Mise à prix
                    </span>
                    <span 
                      className="text-sm"
                      style={{
                        color: active ? "var(--brand)" : "var(--muted)",
                        transition: "color .25s ease",
                      }}
                    >
                      {d.price}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stats et CTAs */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--brand)" }}>
              {Math.round((descriptifs.reduce((sum, d) => {
                const start = parseInt(d.price.replace(/[^0-9]/g, ''));
                const end = parseInt(d.result.replace(/[^0-9]/g, ''));
                return sum + ((end - start) / start * 100);
              }, 0) / descriptifs.length))}%
            </div>
            <p className="text-xs text-muted mt-1">Plus-value moyenne</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--brand)" }}>
              {descriptifs.length}
            </div>
            <p className="text-xs text-muted mt-1">Objets vedettes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Chevrons améliorés */
function ChevronLeftBlack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 19L8 12L15 5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightBlack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5L16 12L9 19"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}