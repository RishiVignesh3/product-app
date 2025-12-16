import { authService } from './authService'

const API_BASE_URL = 'http://localhost:8080/api/v1'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  skipAuth?: boolean
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
    const { method = 'GET', body, headers = {}, skipAuth = false } = options

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Add auth header if authenticated and not skipping auth
    if (!skipAuth) {
      const token = authService.getAccessToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !isRetry && !skipAuth) {
      try {
        await authService.refreshToken()
        // Retry the request with new token
        return this.request<T>(endpoint, options, true)
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`)
    }

    // Handle empty responses
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    // Try to parse as JSON, fall back to text if it fails
    try {
      return JSON.parse(text)
    } catch {
      // Response is not JSON, return the text as-is
      return text as T
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  async put<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  async patch<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

export const api = new ApiService(API_BASE_URL)
