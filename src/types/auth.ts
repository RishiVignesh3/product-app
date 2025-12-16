export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  username: string
  role: 'USER' | 'ADMIN'
  userId: string
}

export interface User {
  username: string
  role: 'USER' | 'ADMIN'
  id: string
}

