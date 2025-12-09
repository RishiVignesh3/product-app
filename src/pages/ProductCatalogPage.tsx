import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { productService, type SortOption } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import type { Product } from '../types/product'

type ViewMode = 'grid' | 'list'

export function ProductCatalogPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { totalItems, totalPrice } = useCart()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const fetchProducts = useCallback(async (sort: SortOption) => {
    try {
      setLoading(true)
      const data = await productService.getAll(sort)
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(sortBy)
  }, [sortBy, fetchProducts])

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Only filter by search on client side (sorting is done by server)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products
    }

    const query = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0)
  }, [products])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-rose-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-rose-300/80 mb-6">{error}</p>
          <button 
            onClick={() => fetchProducts(sortBy)} 
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:shadow-rose-500/40 active:scale-95"
          >
            Try Again
          </button>
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
            <div className="flex flex-col gap-4 py-4 lg:py-6">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                      Product Catalog
                    </span>
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    {loading ? 'Loading...' : `${products.length} products · $${totalValue.toLocaleString()} inventory value`}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-1 hidden sm:inline">View:</span>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      aria-label="Grid view"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      aria-label="List view"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </button>
                  </div>

                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    className="relative p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-bold text-white shadow-lg">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                    {totalItems > 0 && (
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        ${totalPrice.toFixed(2)}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/50 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-xs font-bold uppercase">
                        {user?.username?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden sm:inline">{user?.username}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)} 
                        />
                        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-slate-700/50 bg-slate-900 p-1 shadow-xl">
                          <div className="px-3 py-2 border-b border-slate-700/50">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">{user?.role}</p>
                          </div>
                          <Link
                            to="/cart"
                            className="w-full mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            My Cart ({totalItems})
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                            Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-3 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="relative sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    disabled={loading}
                    className="w-full appearance-none rounded-xl border border-slate-700/50 bg-slate-800/50 py-3 pl-4 pr-10 text-white outline-none transition-all duration-200 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock">Stock Level</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {loading ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
                : 'flex flex-col gap-3'
            }>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-10 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-slate-400 mb-6 max-w-sm">
                No products match your search for "{searchQuery}". Try adjusting your search terms.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-xl bg-slate-800 px-6 py-2.5 font-medium text-white hover:bg-slate-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="mb-4 text-sm text-slate-400">
                  Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
              
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
                  : 'flex flex-col gap-3'
              }>
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </>
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
