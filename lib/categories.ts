// lib/categories.ts
export type Category = {
  slug: string;
  label: string;
  image: string;
  description: string;
  icon?: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "montres",
    label: "Montres",
    image: "/objects/montres.jpg",
    description: "Montres vintage, classiques et de luxe. Retrouvez les plus beaux timepieces de collection.",
  },
  {
    slug: "bijoux",
    label: "Bijoux",
    image: "/objects/bijoux.jpg",
    description: "Bijoux anciens et contemporains. Une sélection de pièces uniques et authentiques.",
  },
  {
    slug: "art",
    label: "Art",
    image: "/objects/art.jpg",
    description: "Œuvres d'art originales, gravures et sculptures. Découvrez des créations uniques.",
  },
  {
    slug: "design",
    label: "Design",
    image: "/objects/design.webp",
    description: "Mobilier et objets de design. Des créations iconiques et contemporaines.",
  },
  {
    slug: "sacs",
    label: "Sacs",
    image: "/objects/sacs.avif",
    description: "Sacs à main, sacs de voyage et accessoires. Les plus grandes marques du luxe.",
  },
  {
    slug: "vinyls",
    label: "Vinyls",
    image: "/objects/vinyls.jpg",
    description: "Disques vinyles et albums collectionneurs. Une richesse musicale intemporelle.",
  },
  {
    slug: "bd",
    label: "BD",
    image: "/objects/bd.png",
    description: "Bandes dessinées et comics rares. Des éditions limitées et collector.",
  },
  {
    slug: "mobilier",
    label: "Mobilier",
    image: "/objects/mobilier.jpg",
    description: "Meubles anciens et modernes. Des pièces de caractère pour votre intérieur.",
  },
  {
    slug: "photographie",
    label: "Photographie",
    image: "/objects/photographie.jpg",
    description: "Appareils photo vintage et photographies d'époque. L'art de la capture d'image.",
  },
  {
    slug: "instruments",
    label: "Instruments",
    image: "/objects/instruments.jpg",
    description: "Instruments de musique rares et anciens. Pour les musiciens et passionnés.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === decodeURIComponent(slug));
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((cat) => cat.slug);
}
