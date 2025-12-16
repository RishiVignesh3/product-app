import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { wishListService } from '../services/wishListService'

interface WishlistButtonProps {
  productId: number
  size?: 'sm' | 'md'
}

export function useWishlist(productId: number) {
  const { user } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return
      try {
        const wishList = await wishListService.getWishList(user.id)
        setIsWishlisted(wishList.some((item) => item.id === productId))
      } catch {
        // Silently fail - wishlist check is not critical
      }
    }
    checkWishlist()
  }, [user, productId])

  const toggleWishlist = async () => {
    if (!user) return

    const wasWishlisted = isWishlisted

    // Optimistic update
    setIsWishlisted(!wasWishlisted)
    setIsLoading(true)

    try {
      if (wasWishlisted) {
        await wishListService.removeFromWishList(productId, user.id)
      } else {
        await wishListService.addToWishList(productId, user.id)
      }
    } catch {
      // Revert on error
      setIsWishlisted(wasWishlisted)
    } finally {
      setIsLoading(false)
    }
  }

  return { isWishlisted, isLoading, toggleWishlist, isAuthenticated: !!user }
}

export function WishlistButton({ productId, size = 'md' }: WishlistButtonProps) {
  const { isWishlisted, isLoading, toggleWishlist, isAuthenticated } = useWishlist(productId)

  const sizeClasses = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  const iconClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  if (!isAuthenticated) return null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${sizeClasses} flex items-center justify-center rounded-xl border transition-all duration-300 ${
        isWishlisted
          ? 'border-rose-500/50 bg-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/20 hover:bg-rose-500/30'
          : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isWishlisted ? 0 : 1.5}
          className={`${iconClasses} transition-transform duration-300 ${isWishlisted ? 'scale-110' : 'hover:scale-110'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      )}
    </button>
  )
}

