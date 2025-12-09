import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import type { Product } from '../types/product'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart, removeFromCart, isInCart, getItemQuantity, updateQuantity } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const inCart = product ? isInCart(product.id) : false
  const quantity = product ? getItemQuantity(product.id) : 0

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await productService.getById(Number(id))
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    setIsUpdating(true)
    try {
      await addToCart(product.id)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleIncrement = async () => {
    if (!product || quantity >= product.stockQuantity) return
    setIsUpdating(true)
    try {
      await updateQuantity(product.id, quantity + 1)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecrement = async () => {
    if (!product) return
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-slate-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-rose-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Product Not Found</h2>
          <p className="text-rose-300/80 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-95"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const stockStatus = product.stockQuantity > 50 
    ? { text: 'In Stock', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    : product.stockQuantity > 10 
      ? { text: 'Low Stock', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
      : product.stockQuantity > 0
        ? { text: 'Limited Stock', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
        : { text: 'Out of Stock', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }

  return (
    <div className="min-h-screen bg-slate-950 scrollbar-thin">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 lg:py-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span>Back to Products</span>
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                View Cart
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image/Icon */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                
                {/* In Cart Badge */}
                {inCart && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-sm font-medium text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {quantity} in cart
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${stockStatus.color}`}>
                  <span className="mr-2 h-2 w-2 rounded-full bg-current animate-pulse" />
                  {stockStatus.text}
                </span>
                <span className="text-sm text-slate-500">
                  {product.stockQuantity} units available
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Product ID</p>
                  <p className="text-lg font-semibold text-white">#{product.id}</p>
                </div>
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stock</p>
                  <p className="text-lg font-semibold text-white">{product.stockQuantity} units</p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="mt-auto space-y-4">
                {inCart ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDecrement}
                        disabled={isUpdating}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-50"
                      >
                        {quantity === 1 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        )}
                      </button>
                      <span className="w-16 text-center text-xl font-bold text-white">
                        {isUpdating ? (
                          <svg className="animate-spin h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={isUpdating || quantity >= product.stockQuantity}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm text-slate-400">Subtotal</p>
                      <p className="text-2xl font-bold text-white">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isUpdating || product.stockQuantity === 0}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                )}

                <Link
                  to="/cart"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-500">
              © 2024 Product Catalog. Built with React & Tailwind CSS.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

