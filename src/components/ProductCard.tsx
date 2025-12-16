import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { WishlistButton } from './WishlistButton'
import { CartButton, useCartState } from './CartButton'

interface ProductCardProps {
  product: Product
  index: number
  viewMode: 'grid' | 'list'
}

const productIcons = [
  <path key="laptop" strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />,
  <path key="cube" strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />,
  <path key="chip" strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />,
]

function getStockStatus(stockQuantity: number) {
  if (stockQuantity > 50) {
    return { text: 'In Stock', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  }
  if (stockQuantity > 10) {
    return { text: 'Low Stock', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
  }
  return { text: 'Limited', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
}

function ProductIcon({ productId }: { productId: number }) {
  const iconIndex = Number(productId) % productIcons.length
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      {productIcons[iconIndex]}
    </svg>
  )
}

export function ProductCard({ product, index, viewMode }: ProductCardProps) {
  const { name, description, price, stockQuantity } = product
  const { inCart, quantity } = useCartState(product.id)
  const stockStatus = getStockStatus(stockQuantity)

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
              {productIcons[Number(product.id) % productIcons.length]}
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
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">
                ${price.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">{stockQuantity} in stock</p>
            </div>

            <div className="flex items-center gap-2">
              <WishlistButton productId={product.id} size="sm" />
              <CartButton productId={product.id} stockQuantity={stockQuantity} />
            </div>
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
        {/* Top Actions Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Wishlist Button */}
          <WishlistButton productId={product.id} size="sm" />

          {/* In Cart Badge */}
          {inCart && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {quantity} in cart
            </div>
          )}
        </div>

        {/* Header - Clickable */}
        <Link to={`/products/${product.id}`} className="flex items-start justify-between gap-3 mt-10">
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="text-lg font-semibold text-white leading-tight truncate group-hover:text-emerald-300 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30">
            <ProductIcon productId={product.id} />
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

          <CartButton productId={product.id} stockQuantity={stockQuantity} />
        </div>
      </div>
    </div>
  )
}

// Re-export skeleton for convenience
export { ProductCardSkeleton } from './ProductCardSkeleton'
