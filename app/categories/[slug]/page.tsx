"use client";

import Link from "next/link";
import Image from "next/image";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const category = getCategoryBySlug(slug as string);

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Header de catégorie */}
      <div className="mb-12 space-y-4">
        <div className="relative h-64 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10">
          <Image
            src={category.image}
            alt={category.label}
            fill
            priority
            style={{ objectFit: "cover" }}
            className="brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="h1 text-white">{category.label}</h1>
            <p className="mt-2 text-base text-gray-200">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Section d'articles (placeholder pour maintenant) */}
      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="h2">Objets en vente</h2>
          <button className="btn btn-outline">Filtrer</button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards - remplacer avec vraies données */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Image placeholder</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Objet {i + 1}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Prix TBD</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state fallback */}
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Aucun objet dans cette catégorie pour le moment. Revenez bientôt !
          </p>
        </div>
      </section>

      {/* Autres catégories */}
      <section className="border-t border-gray-200 pt-12 dark:border-gray-700">
        <h3 className="h3 mb-6">Explorer d'autres catégories</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${encodeURIComponent(cat.slug)}`}
              className="group relative block overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <span className="text-xs font-semibold text-white drop-shadow">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
