import Link from "next/link";

const CATEGORIES = [
  "Montres", "Bijoux", "Art", "Design", "Sacs",
  "Vinyls", "BD", "Mobilier", "Photographie", "Instruments",
];

export default function CategoriesGrid() {
  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold">Catégories</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/categories/\${encodeURIComponent(c.toLowerCase())}`}
            className="group flex aspect-square items-center justify-center rounded-lg border bg-white text-center text-sm font-medium hover:bg-gray-50"
          >
            <span className="px-2">{c}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}   