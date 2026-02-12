import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../../icons";
import Badge from "../../../components/ui/Badge";
import { useDashboardStats } from "../../../api/queries/stats";
import { formatCurrency, formatNumber } from "../../../lib/utils";

export default function EcommerceMetrics() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
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
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load dashboard statistics
        </p>
      </div>
    );
  }

  const metrics = [
    {
      icon: GroupIcon,
      label: "Total Users",
      value: formatNumber(stats.overview.totalUsers),
      change: 0,
      isIncrease: true,
    },
    {
      icon: BoxIconLine,
      label: "Total Orders",
      value: formatNumber(stats.overview.totalOrders),
      change: 0,
      isIncrease: true,
    },
    {
      icon: BoxIconLine,
      label: "Total Books",
      value: formatNumber(stats.overview.totalBooks),
      change: 0,
      isIncrease: true,
    },
    {
      icon: GroupIcon,
      label: "Total Revenue",
      value: formatCurrency(stats.overview.totalRevenue),
      change: 0,
      isIncrease: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <metric.icon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            {metric.change > 0 && (
              <Badge color={metric.isIncrease ? "success" : "error"}>
                {metric.isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {metric.change}%
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}