import type { WishListResponse } from '../types/wishlist'
import { api } from './api'

export const wishListService = {
    getWishList: (userId: string) => api.get<WishListResponse>(`/wishlist/${userId}`),
    addToWishList: (productId: number, userId: string) => api.post<string>('/wishlist', { productId, userId }),
    removeFromWishList: (productId: number, userId: string) => api.delete<string>(`/wishlist/user/${userId}/product/${productId}`),
}