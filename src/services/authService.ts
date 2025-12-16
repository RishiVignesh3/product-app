import type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from '../types/auth'

const API_BASE_URL = 'http://localhost:8080/api/v1/auth'

const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

class AuthService {
  private refreshPromise: Promise<AuthResponse> | null = null

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Login failed')
    }

    const data: AuthResponse = await response.json()
    this.setTokens(data)
    return data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Registration failed')
    }

    const authData: AuthResponse = await response.json()
    this.setTokens(authData)
    return authData
  }

  async refreshToken(): Promise<AuthResponse> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    this.refreshPromise = (async () => {
      try {
        const request: RefreshTokenRequest = { refreshToken }
        const response = await fetch(`${API_BASE_URL}/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        })

        if (!response.ok) {
          this.clearTokens()
          throw new Error('Token refresh failed')
        }

        const data: AuthResponse = await response.json()
        this.setTokens(data)
        return data
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async logout(): Promise<void> {
    const token = this.getAccessToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      } catch {
        // Ignore logout errors
      }
    }
    this.clearTokens()
  }

  private setTokens(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ username: data.username, role: data.role, id: data.userId })
    )
  }

  private clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  getUser(): { username: string; role: 'USER' | 'ADMIN', id: string } | null {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export const authService = new AuthService()

