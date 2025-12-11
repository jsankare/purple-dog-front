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

export const bidsService = {
  /**
   * Placer une enchère sur un objet
   */
  async placeBid(data: {
    objectId: string
    amount: number
    isAutoBid?: boolean
    maxAutoBidAmount?: number
  }) {
    return apiCall('/api/bids', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Récupérer l'historique des enchères d'un objet
   */
  async getObjectBids(objectId: string) {
    return apiCall(`/api/bids/object/${objectId}`)
  },

  /**
   * Récupérer mes enchères
   */
  async getMyBids() {
    return apiCall('/api/bids/my-bids')
  },
}
