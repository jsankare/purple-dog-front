const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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

export const profileAPI = {
  getProfile: async () => {
    return apiCall('/api/profile');
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    } | string;
    companyName?: string;
    siret?: string;
    website?: string;
    socialMedia?: any;
    newsletterSubscription?: boolean;
  }) => {
    return apiCall('/api/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changeEmail: async (newEmail: string, password: string) => {
    return apiCall('/api/profile/change-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail, password }),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiCall('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getNotifications: async () => {
    return apiCall('/api/profile/notifications');
  },

  updateNotifications: async (newsletterSubscription: boolean) => {
    return apiCall('/api/profile/notifications', {
      method: 'PUT',
      body: JSON.stringify({ newsletterSubscription }),
    });
  },
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    isOver18?: boolean;
    acceptedGDPR: boolean;
    newsletterSubscription?: boolean;
    companyName?: string;
    siret?: string;
    website?: string;
    acceptedTerms?: boolean;
    acceptedMandate?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || data.error || 'Erreur lors de l\'inscription');
    }

    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }

    return data;
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
