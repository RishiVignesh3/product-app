import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = authService.getUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials)
    setUser({ username: response.username, role: response.role })
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data)
    setUser({ username: response.username, role: response.role })
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

