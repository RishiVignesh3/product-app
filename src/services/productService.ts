import { api } from './api'
import type { Product } from '../types/product'

export type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock'

export const productService = {
  getAll: (sortBy?: SortOption) => {
    const params = sortBy ? `?sortBy=${sortBy}` : ''
    return api.get<Product[]>(`/products${params}`)
  },
  
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  
  create: (product: Omit<Product, 'id'>) => api.post<Product>('/products', product),
  
  update: (id: number, product: Partial<Omit<Product, 'id'>>) => 
    api.put<Product>(`/products/${id}`, product),
  
  delete: (id: number) => api.delete<void>(`/products/${id}`),
}
