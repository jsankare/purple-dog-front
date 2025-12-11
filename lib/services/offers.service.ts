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

export const offersService = {
  /**
   * Créer une offre d'achat
   */
  async create(data: {
    objectId: string
    amount: number
    message?: string
  }) {
    return apiCall('/api/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Accepter une offre (vendeur)
   */
  async accept(offerId: string) {
    return apiCall(`/api/offers/${offerId}/accept`, {
      method: 'PUT',
    })
  },

  /**
   * Rejeter une offre (vendeur)
   */
  async reject(offerId: string) {
    return apiCall(`/api/offers/${offerId}/reject`, {
      method: 'PUT',
    })
  },

  /**
   * Récupérer mes offres
   */
  async getMyOffers() {
    return apiCall('/api/offers/my-offers')
  },
}
