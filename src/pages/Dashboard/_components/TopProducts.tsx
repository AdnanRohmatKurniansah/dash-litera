/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTopProducts } from '../../../api/queries/stats'
import { TrendingUp } from 'lucide-react'
import { formatRp } from '../../../lib/utils'
import { Link } from 'react-router'

export default function TopProducts() {
  const { data, isLoading, error } = useTopProducts(5)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-5" />
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 pt-5 pb-4 dark:border-red-800 dark:bg-red-900/10 sm:px-6">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load top products</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Top Products</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Best selling books</p>
        </div>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {data.map((item: any, index: number) => (
          <div key={item.book?.id ?? index} className="flex items-center gap-3">
            <span className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-700' :
              index === 1 ? 'bg-gray-100 text-gray-600' :
              index === 2 ? 'bg-orange-100 text-orange-600' :
              'bg-gray-50 text-gray-400'
            }`}>
              {index + 1}
            </span>

            {item.book?.image_url ? (
              <img
                src={item.book.image_url}
                alt={item.book.name}
                className="w-10 h-14 object-cover rounded border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-10 h-14 rounded border border-gray-200 bg-gray-100 dark:bg-gray-800 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <Link
                to={`/dashboard/book/edit/${item.book?.id}`}
                className="text-sm font-medium text-gray-800 dark:text-white/90 truncate block hover:text-blue-600 transition-colors">
                {item.book?.name ?? '-'}
              </Link>
              <p className="text-xs text-gray-500 truncate">
                {formatRp(item.book?.discount_price ?? item.book?.price ?? 0)}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-800 dark:text-white/90">{item.totalSold}</p>
              <p className="text-xs text-gray-500">sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}