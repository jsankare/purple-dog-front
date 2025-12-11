const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const categoriesService = {
  /**
   * Récupérer la liste des catégories
   */
  async list() {
    const response = await fetch(`${API_URL}/api/categories?limit=50`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erreur chargement catégories')
    }

    return data
  },
}
