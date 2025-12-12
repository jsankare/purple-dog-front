'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: 'particulier' | 'professionnel' | 'admin'
  firstName?: string
  lastName?: string
  subscriptionStatus?: string
  subscriptionEndDate?: string
  _verified?: boolean
  canBid?: boolean
  canSell?: boolean
  stripePaymentMethodId?: string
  hasValidPaymentMethod?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any | FormData) => Promise<any>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      setIsLoading(true)
      const response = await authAPI.me()
      setUser(response.user)
    } catch (error) {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      
      // Check verification status if present
      if (response.user._verified === false) {
        // Logout immediately if not verified (just in case Payload set a cookie)
        await authAPI.logout()
        throw new Error("Please verify your email")
      }

      setUser(response.user)
      if (response.token) {
        document.cookie = `payload-token=${response.token}; path=/; max-age=86400; SameSite=Lax`
      }
      return response
    } finally {
      setIsLoading(false)
    }
  }

  async function register(data: any) {
    setIsLoading(true)
    try {
      const response = await authAPI.register(data)
      return response
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await authAPI.logout()
      setUser(null)
      document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    } finally {
      setIsLoading(false)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAuthenticated: !!user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
