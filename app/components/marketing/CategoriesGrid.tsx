// app/components/CategoriesGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { CATEGORIES } from "@/lib/categories";

function CategoryCard({
  label,
  slug,
  image,
}: {
  label: string;
  slug: string;
  image?: string;
}) {
  return (
    <Link
      href={`/categories/${encodeURIComponent(slug)}`}
      aria-label={`Voir la catégorie ${label}`}
      className="
        group relative block overflow-hidden rounded-app border-subtle
        will-change-transform
        transition-transform duration-200 ease-out
        hover:scale-[1.03] focus-visible:scale-[1.03]
        focus-visible:outline-none
      "
    >
      <div
        className="
          relative aspect-square w-full
          rounded-app
          ring-1 ring-black/5 dark:ring-white/10
          transition-shadow duration-200
          group-hover:shadow-lg group-hover:shadow-black/10 dark:group-hover:shadow-white/5
        "
      >
        {/* Image optimisée */}
        <Image
          src={image ?? "/objects/fallback.jpg"}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          priority={false}
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 ease-out group-hover:scale-105"
        />

        {/* Léger zoom + assombrissement progressif */}
        <div
          className="
            absolute inset-0
            bg-linear-to-t from-black/60 via-black/10 to-transparent
            transition-opacity duration-300
            group-hover:opacity-100
          "
          style={{ opacity: 0.9 }}
        />

        {/* Label en bas, glisse légèrement vers le haut au hover */}
        <div
          className="
            absolute bottom-0 left-0 right-0 z-10 px-4 pb-4
            translate-y-0 group-hover:-translate-y-1
            transition-transform duration-300
          "
        >
          <span
            className="
              text-sm font-semibold text-white
              drop-shadow
            "
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            {label}
          </span>
        </div>

        {/* Fallback lettre si pas d'image */}
        {!image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "rgba(0,0,0,0.7)",
              }}
            >
              {label.charAt(0)}
            </span>
          </div>
        )}

        {/* Bordure accentuée au hover */}
        <div
          className="
            pointer-events-none absolute inset-0 rounded-app
            ring-0 group-hover:ring-1 ring-black/10 dark:ring-white/20
            transition-[ring-width,opacity] duration-200
          "
        />
      </div>
    </Link>
  );
}

function CategoriesGridComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="h3">Parcourez nos catégories</h3>
        <p className="text-sm text-muted mt-2">
          Trouvez les objets de vos rêves parmi notre sélection diverse et curatée
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} label={c.label} slug={c.slug} image={c.image} />
        ))}
      </div>
    </div>
  );
}

export default memo(CategoriesGridComponent);