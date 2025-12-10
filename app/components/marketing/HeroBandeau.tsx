"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  { src: "/objects/montres.jpg", alt: "Objet 1" },
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
    window.setTimeout(() => setAnimating(false), 450);
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
    }, 4000);
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
      {/* Carrousel (fade) */}
      <div
  className="relative w-full overflow-hidden rounded-app border-subtle surface-2 md:mt-18"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label="Carrousel d’objets en vedette"
      >
        <div className="relative aspect-video">
          {/* Slides superposées */}
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: i === index ? 1 : 0,
                transition: "opacity 450ms ease",
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

          {/* Flèches simples noires */}
          <button
            type="button"
            onClick={prev}
            aria-label="Image précédente"
            className="group absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full"
            style={{ background: "transparent", padding: "6px" }}
          >
            <ChevronLeftBlack />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Image suivante"
            className="group absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full"
            style={{ background: "transparent", padding: "6px" }}
          >
            <ChevronRightBlack />
          </button>

          {/* Puces */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à l’image \${i + 1}`}
                className="h-2.5 w-2.5 rounded-full border"
                style={{
                  borderColor: "var(--text)",
                  background: i === index ? "var(--text)" : "transparent",
                  opacity: i === index ? 0.9 : 0.5,
                  transition: "opacity .2s ease, background .2s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Descriptif synchronisé avec mise en avant typographique de la ligne active */}
      <div className="space-y-5">
        <div>
          <h2 className="h2">Objets en vedette</h2>
          <p className="mt-2 text-muted">Sélection d’objets et résultats de vente passés.</p>
        </div>

        <div className="rounded-app border-subtle surface">
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {descriptifs.map((d, i) => {
              const active = i === index;
              return (
                <li
                  key={i}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => goTo(i)}
                  style={{
                    background: active ? "var(--surface-2)" : "var(--surface)",
                    borderLeft: active ? "3px solid var(--brand)" : "3px solid transparent",
                    transition: "background-color .25s ease, border-color .25s ease",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: active ? 700 : 600, 
                        letterSpacing: active ? "0.1px" : "0px",
                        transition: "color .25s ease, font-weight .25s ease, letter-spacing .25s ease",
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "var(--muted)",
                        transition: "color .25s ease",
                      }}
                    >
                      Estimation: {d.price}
                    </div>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      fontWeight: active ? 700 : 600,
                      color: active ? "" : "var(--text)",
                      transition: "color .25s ease, font-weight .25s ease",
                    }}
                  >
                    {d.result}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* Chevrons simples noirs */
function ChevronLeftBlack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 19L8 12L15 5"
        stroke="#111111"
        strokeWidth="2"
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
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}