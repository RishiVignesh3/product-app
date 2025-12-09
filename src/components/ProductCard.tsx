import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
  index: number
  viewMode: 'grid' | 'list'
}

export function ProductCard({ product, index, viewMode }: ProductCardProps) {
  const { name, description, price, stockQuantity } = product
  const { addToCart, removeFromCart, isInCart, getItemQuantity, updateQuantity } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const inCart = isInCart(product.id)
  const quantity = getItemQuantity(product.id)

  const stockStatus = stockQuantity > 50 
    ? { text: 'In Stock', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    : stockQuantity > 10 
      ? { text: 'Low Stock', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
      : { text: 'Limited', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }

  const productIcons = [
    <path key="laptop" strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />,
    <path key="cube" strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />,
    <path key="chip" strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />,
  ]

  const iconIndex = product.id % productIcons.length

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    try {
      await addToCart(product.id)
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
        await updateQuantity(product.id, quantity + 1)
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
        await updateQuantity(product.id, quantity - 1)
      } else {
        await removeFromCart(product.id)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const CartButton = () => {
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

  if (viewMode === 'list') {
    return (
      <div 
        className="animate-fade-in-up group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {inCart && (
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-cyan-500" />
        )}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 sm:p-5">
          {/* Icon - Clickable */}
          <Link 
            to={`/products/${product.id}`}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 transition-transform duration-300 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
              {productIcons[iconIndex]}
            </svg>
          </Link>

          {/* Content - Clickable */}
          <Link to={`/products/${product.id}`} className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h3 className="text-lg font-semibold text-white truncate hover:text-emerald-300 transition-colors">
                {name}
              </h3>
              <span className={`inline-flex self-start items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
              {inCart && (
                <span className="inline-flex self-start items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  In Cart
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400 line-clamp-1">
              {description}
            </p>
          </Link>

          {/* Price & Action */}
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">
                ${price.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">{stockQuantity} in stock</p>
            </div>
            
            <CartButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="animate-fade-in-up group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-[1px] shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Gradient border effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${inCart ? 'bg-gradient-to-br from-emerald-400/30 via-cyan-500/30 to-purple-600/30 opacity-100' : 'bg-gradient-to-br from-emerald-400/20 via-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100'}`} />
      
      <div className="relative h-full rounded-2xl bg-slate-900 p-5 flex flex-col">
        {/* In Cart Badge */}
        {inCart && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {quantity} in cart
          </div>
        )}

        {/* Header - Clickable */}
        <Link to={`/products/${product.id}`} className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="text-lg font-semibold text-white leading-tight truncate group-hover:text-emerald-300 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              {productIcons[iconIndex]}
            </svg>
          </div>
        </Link>
        
        {/* Stock Status */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${stockStatus.color}`}>
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {stockStatus.text}
          </span>
          <span className="text-xs text-slate-500">
            {stockQuantity} units available
          </span>
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/80">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Price</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ${price.toFixed(2)}
            </p>
          </div>
          
          <CartButton />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="w-full rounded-xl bg-slate-900/80 border border-slate-700/50 p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="h-14 w-14 rounded-xl animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded animate-shimmer" />
            <div className="h-4 w-full max-w-md rounded animate-shimmer" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 rounded animate-shimmer" />
            <div className="h-10 w-28 rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded animate-shimmer" />
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-3/4 rounded animate-shimmer" />
        </div>
        <div className="h-12 w-12 rounded-xl animate-shimmer" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 rounded-full animate-shimmer" />
        <div className="h-6 w-16 rounded animate-shimmer" />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="h-8 w-24 rounded animate-shimmer" />
        <div className="h-10 w-24 rounded-xl animate-shimmer" />
      </div>
    </div>
  )
}
