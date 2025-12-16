import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface CartButtonProps {
  productId: number
  stockQuantity: number
}

export function CartButton({ productId, stockQuantity }: CartButtonProps) {
  const { addToCart, removeFromCart, isInCart, getItemQuantity, updateQuantity } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const inCart = isInCart(productId)
  const quantity = getItemQuantity(productId)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    try {
      await addToCart(productId)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity < stockQuantity) {
      setIsUpdating(true)
      try {
        await updateQuantity(productId, quantity + 1)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    try {
      if (quantity > 1) {
        await updateQuantity(productId, quantity - 1)
      } else {
        await removeFromCart(productId)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  if (inCart) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrement}
          disabled={isUpdating}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors active:scale-95 disabled:opacity-50"
        >
          {quantity === 1 ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          )}
        </button>
        <span className="w-8 text-center text-sm font-semibold text-white">
          {isUpdating ? (
            <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= stockQuantity || isUpdating}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isUpdating}
      className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 disabled:opacity-50"
    >
      {isUpdating ? (
        <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : 'Add to Cart'}
    </button>
  )
}

// Export cart state hook for use in other components
export function useCartState(productId: number) {
  const { isInCart, getItemQuantity } = useCart()
  return {
    inCart: isInCart(productId),
    quantity: getItemQuantity(productId)
  }
}

