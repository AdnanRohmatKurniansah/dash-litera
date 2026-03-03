import { BoxIconLine, GroupIcon } from "../../../icons";
import Badge from "../../../components/ui/Badge";
import { useDashboardStats } from "../../../api/queries/stats";
import { formatCurrency, formatNumber } from "../../../lib/utils";
import { ShoppingCart, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function EcommerceMetrics() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="mt-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20" />
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/10">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load dashboard statistics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <GroupIcon className="size-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(stats.overview.totalUsers)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20">
          <BoxIconLine className="size-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Books</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(stats.overview.totalBooks)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
          <ShoppingCart className="size-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(stats.overview.totalOrders)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20">
          <GroupIcon className="size-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatCurrency(stats.overview.totalRevenue)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <Clock className="size-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(stats.overview.pendingOrders)}
            </h4>
          </div>
          {stats.overview.pendingOrders > 0 && (
            <Badge color="warning" size="sm">Needs action</Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
          <CheckCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Completed Orders</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(stats.overview.completedOrders)}
          </h4>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Low Stock Books</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(stats.overview.lowStockBooks)}
            </h4>
          </div>
          {stats.overview.lowStockBooks > 0 && (
            <Badge color="error" size="sm">Restock</Badge>
          )}
        </div>
      </div>
    </div>
  );
}