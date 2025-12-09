import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'
import type { CartItemResponse } from '../types/cart'

interface CartContextType {
  items: CartItemResponse[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addToCart: (productId: number, quantity?: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getItemQuantity: (productId: number) => number
  isInCart: (productId: number) => boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItemResponse[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setTotalItems(0)
      setTotalPrice(0)
      return
    }

    try {
      setIsLoading(true)
      const cart = await cartService.getCart()
      setItems(cart.items)
      setTotalItems(cart.totalItems)
      setTotalPrice(cart.totalPrice)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    try {
      await cartService.addToCart({ productId, quantity })
      await refreshCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }, [refreshCart])

  const removeFromCart = useCallback(async (productId: number) => {
    try {
      await cartService.removeFromCart(productId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      throw error
    }
  }, [refreshCart])

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    try {
      await cartService.updateQuantity(productId, quantity)
      await refreshCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
      throw error
    }
  }, [removeFromCart, refreshCart])

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart()
      setItems([])
      setTotalItems(0)
      setTotalPrice(0)
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }, [])

  const getItemQuantity = useCallback((productId: number) => {
    const item = items.find((i) => i.productId === productId)
    return item?.quantity ?? 0
  }, [items])

  const isInCart = useCallback((productId: number) => {
    return items.some((item) => item.productId === productId)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
