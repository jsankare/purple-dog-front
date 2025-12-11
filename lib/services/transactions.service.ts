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

export const transactionsService = {
  /**
   * Créer une session de checkout Stripe
   */
  async createCheckout(transactionId: string) {
    return apiCall(`/api/transactions/${transactionId}/checkout`, {
      method: 'POST',
    })
  },

  /**
   * Récupérer mes achats
   */
  async getMyPurchases() {
    return apiCall('/api/transactions/my-purchases')
  },

  /**
   * Récupérer mes ventes
   */
  async getMySales() {
    return apiCall('/api/transactions/my-sales')
  },

  /**
   * Confirmer la livraison (acheteur)
   */
  async confirmDelivery(transactionId: string) {
    return apiCall(`/api/transactions/${transactionId}/confirm-delivery`, {
      method: 'POST',
    })
  },
}
