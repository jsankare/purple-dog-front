// Configuration de l'API Payload CMS 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper pour les appels API
async function apiCall(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
}

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
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || result.error || 'Erreur lors de l\'inscription');
    }

    try {
      const loginResult = await authAPI.login({
        email: data.email,
        password: data.password,
      });
      
      return {
        success: true,
        user: result.doc || result.user || loginResult.user,
        token: loginResult.token,
      };
    } catch (loginError) {
      return {
        success: true,
        user: result.doc || result.user,
        message: 'Compte créé. Veuillez vous connecter.',
      };
    }
  },

  login: async (data: { email: string; password: string }) => {
    const result = await apiCall('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.token && typeof window !== 'undefined') {
      localStorage.setItem('token', result.token);
    }
    
    return result;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return apiCall('/api/users/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return apiCall('/api/users/me');
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
    
    const response = await fetch(`${API_BASE_URL}/api/objects/create`, {
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
};
