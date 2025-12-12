import Link from "next/link";

const categories = [
  {
    name: "Art & Peinture",
    count: "342 objets",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop"
  },
  {
    name: "Horlogerie",
    count: "198 objets",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop"
  },
  {
    name: "Mobilier",
    count: "156 objets",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  },
  {
    name: "Livres anciens",
    count: "284 objets",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop"
  },
  {
    name: "Vins & Spiritueux",
    count: "127 objets",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop"
  },
  {
    name: "Photographie",
    count: "89 objets",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=400&h=400&fit=crop"
  },
  {
    name: "Bijoux",
    count: "215 objets",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
  },
  {
    name: "Instruments",
    count: "67 objets",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
  },
  {
    name: "Mode & Accessoires",
    count: "178 objets",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
  },
  {
    name: "Collection",
    count: "234 objets",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop"
  },
];

export default function CategoriesGrid() {
  return (
    <section className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 p-8 lg:p-12">
      <div className="mb-10">
        <h2 className="text-3xl lg:text-4xl font-serif text-neutral-900 dark:text-white mb-4">
          Catégories d'objets
        </h2>
        <div className="w-16 h-px bg-[#4B2377] dark:bg-[#6d28d9]"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          return (
            <Link
              key={category.name}
              href={`/encheres?category=${category.name.toLowerCase()}`}
              className="aspect-square border-2 border-neutral-200 hover:border-[#4B2377] dark:border-neutral-800 dark:hover:border-[#6d28d9] transition-all group relative overflow-hidden rounded-none dark:rounded-lg"
            >
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-100 dark:opacity-70 dark:group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50"></div>
              </div>

              <div className="relative h-full flex flex-col justify-end p-4 text-white">
                <h3 className="font-semibold text-sm md:text-base mb-1 drop-shadow-lg text-white">
                  {category.name}
                </h3>
                <p className="text-xs text-white/90 dark:text-neutral-300 drop-shadow">
                  {category.count}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
