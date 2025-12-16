interface ProductCardSkeletonProps {
  viewMode: 'grid' | 'list'
}

export function ProductCardSkeleton({ viewMode }: ProductCardSkeletonProps) {
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

