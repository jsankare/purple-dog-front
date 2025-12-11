const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function apiCall(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}

export const favoritesService = {
  /**
   * Toggle favori (ajouter ou retirer)
   */
  async toggle(objectId: string) {
    return apiCall('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ objectId }),
    })
  },

  /**
   * Récupérer la liste de mes favoris
   */
  async list() {
    return apiCall('/api/favorites')
  },
}
