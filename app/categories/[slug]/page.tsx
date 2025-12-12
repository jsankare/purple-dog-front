"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories, type Category } from "@/lib/categories";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setAllCategories(cats);
      const found = cats.find((c) => c.slug === slug);
      setCategory(found || null);
      setLoading(false);
    };
    loadCategories();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-[#4B2377] rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F9F3FF] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header de catégorie */}
        <div className="mb-12">
          <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border border-neutral-200">
            <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-4xl font-serif text-white mb-2">{category.name}</h1>
              <p className="text-base text-gray-200">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Section d'articles (placeholder pour maintenant) */}
        <section className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral-900">Objets en vente</h2>
            <button className="px-4 py-2 border border-neutral-300 hover:border-[#4B2377] transition-colors">
              Filtrer
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards - remplacer avec vraies données */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md bg-white"
              >
                <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Image placeholder</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900">Objet {i + 1}</h3>
                  <p className="mt-1 text-sm text-gray-600">Prix TBD</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state fallback */}
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-12 text-center bg-white">
            <p className="text-gray-600">
              Aucun objet dans cette catégorie pour le moment. Revenez bientôt !
            </p>
          </div>
        </section>

        {/* Autres catégories */}
        <section className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">
            Explorer d'autres catégories
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {allCategories
              .filter((c) => c.slug !== category.slug)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${encodeURIComponent(cat.slug)}`}
                  className="group relative block overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-[#4B2377] hover:shadow-md bg-gradient-to-br from-purple-100 to-purple-50"
                >
                  <div className="relative aspect-square w-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <span className="text-sm font-semibold text-[#4B2377]">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
