import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, isLoading } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  const tax = totalPrice * 0.1 // 10% tax
  const shipping = totalPrice > 100 ? 0 : 9.99
  const grandTotal = totalPrice + tax + shipping

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      await updateQuantity(productId, quantity)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleRemoveItem = async (productId: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      await removeFromCart(productId)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-slate-400">Loading cart...</p>
        </div>
      </div>
    )
  }

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
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  <span className="hidden sm:inline">Continue Shopping</span>
                </Link>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Shopping Cart
                </span>
              </h1>
              <div className="text-sm text-slate-400">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-12 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-slate-400 mb-8 max-w-sm">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                to="/"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-95"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Clear Cart
                  </button>
                </div>

                {items.map((item, index) => {
                  const isItemUpdating = updatingItems.has(item.productId)
                  
                  return (
                    <div
                      key={item.id}
                      className={`animate-fade-in-up bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sm:p-6 transition-opacity ${isItemUpdating ? 'opacity-60' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Icon */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                          </svg>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {item.productName}
                              </h3>
                              <p className="text-sm text-slate-400 mt-1">
                                Product ID: {item.productId}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={isItemUpdating}
                              className="self-start p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-400">Qty:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                  disabled={isItemUpdating}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-50"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                  </svg>
                                </button>
                                <span className="w-10 text-center text-sm font-semibold text-white">
                                  {isItemUpdating ? (
                                    <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  disabled={isItemUpdating}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-xs text-slate-500">
                                ${item.productPrice.toFixed(2)} each
                              </p>
                              <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                ${item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal ({totalItems} items)</span>
                      <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-medium">Free</span>
                      ) : (
                        <span className="text-white font-medium">${shipping.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Estimated Tax (10%)</span>
                      <span className="text-white font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    {shipping > 0 && (
                      <p className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3">
                        💡 Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                      </p>
                    )}
                    
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-[0.98]">
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/"
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 font-medium text-white hover:bg-slate-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Continue Shopping
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          )}
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
