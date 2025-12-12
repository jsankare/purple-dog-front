// Configuration de l'API Payload CMS
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Créer un objet à vendre
export async function createSaleItem(data: {
  title: string;
  category: string;
  description: string;
  price: number;
  saleType: string;
  status?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        saleType: data.saleType,
        status: data.status || 'pending',
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'annonce');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API createSaleItem:', error);
    throw error;
  }
}

// Récupérer les objets en vente de l'utilisateur
export async function getUserSales(userId?: string) {
  try {
    const url = userId
      ? `${API_URL}/api/sales?where[user][equals]=${userId}`
      : `${API_URL}/api/sales`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des annonces');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API getUserSales:', error);
    throw error;
  }
}

// Mettre à jour le profil utilisateur
export async function updateUserProfile(userId: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notifications?: {
    email: boolean;
    newOffers: boolean;
  };
}) {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API updateUserProfile:', error);
    throw error;
  }
}

// Soumettre un avis
export async function submitReview(data: {
  rating: number;
  npsScore: number;
  comments?: string;
  improvements?: string[];
}) {
  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: data.rating,
        npsScore: data.npsScore,
        comments: data.comments || '',
        improvements: data.improvements || [],
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'avis');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API submitReview:', error);
    throw error;
  }
}

// Helper function for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiCall(endpoint: string, options?: RequestInit) {
  console.log('🌐 apiCall:', endpoint, 'vers', API_BASE_URL)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('🚀 Lancement fetch vers:', `${API_BASE_URL}${endpoint}`)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  console.log('📥 Réponse reçue:', response.status, response.statusText)

  const data = await response.json();
  console.log('📦 Data parsée:', data)

  if (!response.ok) {
    // Payload renvoie les erreurs dans un tableau errors[]
    const errorMessage = data.errors?.[0]?.message || data.error || data.message || JSON.stringify(data);
    console.error('API Call Failed:', endpoint, data);
    throw new Error(errorMessage);
  }

  return data;
}

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    companyName?: string;
    siret?: string;
    website?: string;
    isOver18?: boolean;
    acceptedGDPR?: boolean;
    acceptedTerms?: boolean;
    acceptedMandate?: boolean;
    newsletterSubscription?: boolean;
    officialDocument?: string; // ID of the uploaded document
  }) => {
    const result = await apiCall('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Payload retourne { doc, message }, pas de token lors de l'inscription
    // L'utilisateur doit vérifier son email avant de se connecter
    return {
      user: result.doc,
      message: result.message,
    };
  },

  login: async (data: { email: string; password: string }) => {
    // Utiliser notre endpoint optimisé (le login natif Payload prend ~40s)
    const result = await apiCall('/api/fast-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.token && typeof window !== 'undefined') {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return apiCall('/api/users/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return apiCall('/api/users/me');
  },

  verifyEmail: async (token: string) => {
    // Utiliser notre endpoint optimisé (Nécessaire car l'endpoint natif est ~30s+)
    const response = await fetch(`${API_URL}/api/verify-email/${token}`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors?.[0]?.message || data.error || data.message || 'Erreur de vérification';
      throw new Error(errorMessage);
    }

    return data;
  },

  resendVerification: async (email: string) => {
    return apiCall('/api/users/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export const mediaAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Standard Payload media upload endpoint
    const response = await fetch(`${API_URL}/api/media`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Erreur lors de l\'upload du fichier');
    }

    return data;
  },
};

export const usersAPI = {
  checkLogin: async () => {
    return apiCall('/api/users/login-check');
  },

  canBidSell: async () => {
    return apiCall('/api/users/can-bid-sell');
  },
};


export const objectsAPI = {
  createObject: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/objects/create`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création de l\'objet');
    }

    return data;
  },

  create: async (data: any) => {
    return apiCall('/api/objects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    saleMode?: 'auction' | 'quick_sale';
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    // Search logic: Name OR Description
    if (params?.search) {
      query.append('where[or][0][name][like]', params.search);
      query.append('where[or][1][description][like]', params.search);
    }

    // Filters
    if (params?.category && params.category !== 'all') {
      query.append('where[category][equals]', params.category);
    }
    if (params?.saleMode) {
      query.append('where[saleMode][equals]', params.saleMode);
    }
    if (params?.status && params.status !== 'all') {
      query.append('where[status][equals]', params.status);
    }

    // Price filters (Basic implementation for Quick Sale)
    if (params?.minPrice) {
      // Note: complex OR logic for multiple prices omitted for clarity
      // query.append('where[quickSalePrice][greater_than_equal]', params.minPrice.toString());
    }

    return apiCall(`/api/objects?${query.toString()}`);
  },

  getById: async (id: string) => {
    return apiCall(`/api/objects/${id}`);
  },
};

export const profileAPI = {
  getProfile: async () => {
    return apiCall('/api/profile');
  },

  updateProfile: async (data: any) => {
    return apiCall('/api/profile/update', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  changeEmail: async (data: { newEmail: string; password: string }) => {
    return apiCall('/api/profile/change-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiCall('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getNotifications: async () => {
    return apiCall('/api/profile/notifications');
  },

  updateNotifications: async (data: any) => {
    return apiCall('/api/profile/notifications', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  updateBankDetails: async (bankData: any) => {
    return apiCall('/api/profile/bank-details', {
      method: 'PATCH',
      body: JSON.stringify(bankData),
    });
  },
};

// ============================================
// NOUVEAUX ENDPOINTS BACKEND
// ============================================

export const categoriesAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);

    return apiCall(`/api/categories?${query.toString()}`);
  },
};

export const bidsAPI = {
  placeBid: async (data: { objectId: string; amount: number; isAutoBid?: boolean }) => {
    return apiCall('/api/bids', {
      method: 'POST',
      body: JSON.stringify({
        objectId: data.objectId,
        amount: data.amount,
        isAutoBid: data.isAutoBid,
      }),
    });
  },

  getObjectBids: async (objectId: string) => {
    return apiCall(`/api/bids/object/${objectId}`);
  },

  getMyBids: async () => {
    return apiCall('/api/bids/my-bids');
  },
};

export const offersAPI = {
  makeOffer: async (data: { objectId: string; amount: number; message?: string }) => {
    return apiCall('/api/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  acceptOffer: async (offerId: string) => {
    return apiCall(`/api/offers/${offerId}/accept`, {
      method: 'PUT',
    });
  },

  rejectOffer: async (offerId: string) => {
    return apiCall(`/api/offers/${offerId}/reject`, {
      method: 'PUT',
    });
  },
};

export const favoritesAPI = {
  getAll: async () => {
    return apiCall('/api/favorites');
  },

  toggle: async (objectId: string) => {
    return apiCall('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ objectId }),
    });
  },
};

export const transactionsAPI = {
  getMyPurchases: async () => {
    return apiCall('/api/transactions/my-purchases');
  },

  getMySales: async () => {
    return apiCall('/api/transactions/my-sales');
  },

  createCheckout: async (transactionId: string) => {
    return apiCall(`/api/transactions/${transactionId}/checkout`, {
      method: 'POST',
    });
  },

  confirmDelivery: async (transactionId: string) => {
    return apiCall(`/api/transactions/${transactionId}/confirm-delivery`, {
      method: 'POST',
    });
  },
};

export const globalsAPI = {
  getSettings: async () => {
    return apiCall('/api/globals/settings');
  },
};
