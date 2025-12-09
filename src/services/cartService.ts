import { api } from './api'
import type { CartResponse, CartItemResponse, AddToCartRequest } from '../types/cart'

export const cartService = {
  getCart: () => api.get<CartResponse>('/cart'),

  addToCart: (request: AddToCartRequest) => 
    api.post<CartItemResponse>('/cart/items', request),

  updateQuantity: (productId: number, quantity: number) => 
    api.put<CartItemResponse | null>(`/cart/items/${productId}?quantity=${quantity}`, {}),

  removeFromCart: (productId: number) => 
    api.delete<void>(`/cart/items/${productId}`),

  clearCart: () => 
    api.delete<void>('/cart'),
}

