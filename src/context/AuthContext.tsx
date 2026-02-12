import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CookieService } from '../services/cookie.service'
import { API_ENDPOINTS } from '../api/endpoint'
import apiClient from '../lib/axios'
import { Admin } from '../types'

interface AuthContextType {
  admin: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  isSuperadmin: boolean
  login: (token: string, isSuperadmin: boolean) => Promise<void>
  logout: () => Promise<void>
  refetchProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isSuperadmin = admin?.role == 'Superadmin'
  const isAuthenticated = Boolean(admin)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const adminToken = CookieService.getAdminToken()

      if (!adminToken && !adminToken) {
        setIsLoading(false)
        return
      }

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ADMIN_PROFILE )
      setAdmin(response.data.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      CookieService.clearAll()
    } finally {
      setIsLoading(false)
    }
  }

  const refetchProfile = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ADMIN_PROFILE)
      setAdmin(response.data.data)
    } catch (error) {
      console.error('Profile refetch failed:', error)
    }
  }

  const login = async (token: string, isAdminLogin: boolean) => {
    if (isAdminLogin) {
      CookieService.setAdminToken(token)
    } else {
      CookieService.setAdminToken(token)
    }
    await checkAuth()
  }

  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGOUT )
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      CookieService.clearAll()
      setAdmin(null)
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated,
        isSuperadmin,
        login,
        refetchProfile,
        logout,
      }}
    >
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