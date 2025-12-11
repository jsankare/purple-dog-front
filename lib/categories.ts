// Fonction utilitaire pour récupérer les catégories depuis l'API

export interface Category {
  id: number | string
  name: string
  slug: string
  description?: string
  isActive: boolean
  order?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Récupère toutes les catégories actives depuis l'API
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/api/categories?where[isActive][equals]=true&sort=order`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Failed to fetch categories:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Récupère une catégorie par son slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/categories?where[slug][equals]=${slug}&limit=1`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

/**
 * Formate les catégories pour un select (avec option "Toutes")
 */
export function formatCategoriesForSelect(
  categories: Category[],
  includeAll: boolean = false
): Array<{ value: string; label: string }> {
  const options = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  }))

  if (includeAll) {
    return [{ value: 'all', label: 'Toutes les catégories' }, ...options]
  }

  return options
}

/**
 * Trouve le nom d'une catégorie depuis son slug
 */
export function getCategoryName(categories: Category[], slug: string): string {
  const category = categories.find((cat) => cat.slug === slug)
  return category?.name || slug
}
