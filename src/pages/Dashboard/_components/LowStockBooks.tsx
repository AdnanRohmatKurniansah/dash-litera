import { useLowStockBooks } from '../../../api/queries/stats'
import { AlertTriangle, Package } from 'lucide-react'
import { Link } from 'react-router'

export default function LowStockBooks() {
  const { data, isLoading, error } = useLowStockBooks(10)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-5" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 pt-5 pb-4 dark:border-red-800 dark:bg-red-900/10 sm:px-6">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load low stock data</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Low Stock Alert</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Books with stock below 10</p>
        </div>
        <AlertTriangle className="w-5 h-5 text-amber-500" />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">All books are well stocked</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((book: { id: string; name: string; image_url?: string; qty: number }) => {
            const stockLevel = book.qty === 0 ? 'out' : book.qty <= 3 ? 'critical' : 'low'
            return (
              <div key={book.id} className="flex items-center gap-3">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.name}
                    className="w-10 h-10 object-cover rounded border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded border border-gray-200 bg-gray-100 dark:bg-gray-800 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/dashboard/book/edit/${book.id}`}
                    className="text-sm font-medium text-gray-800 dark:text-white/90 truncate block hover:text-blue-600 transition-colors"
                  >
                    {book.name}
                  </Link>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    stockLevel === 'out'
                      ? 'bg-red-100 text-red-700'
                      : stockLevel === 'critical'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {book.qty === 0 ? 'Out of stock' : `${book.qty} left`}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}