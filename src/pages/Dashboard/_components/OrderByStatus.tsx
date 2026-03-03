import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useOrderStats } from '../../../api/queries/stats'

const STATUS_COLORS: Record<string, string> = {
  Pending:    '#F59E0B',
  Paid:       '#3B82F6',
  Processing: '#6366F1',
  Completed:  '#10B981',
  Cancelled:  '#9CA3AF',
  Failed:     '#EF4444',
}

export default function OrdersByStatus() {
  const { data, isLoading, error } = useOrderStats()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div className="h-[220px] bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 pt-5 pb-4 dark:border-red-800 dark:bg-red-900/10 sm:px-6">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load order status data</p>
      </div>
    )
  }

  const byStatus: { status: string; _count: { status: number } }[] = data.byStatus ?? []

  const labels = byStatus.map((s) => s.status)
  const series = byStatus.map((s) => s._count.status)
  const colors = labels.map((l) => STATUS_COLORS[l] ?? '#9CA3AF')

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
    },
    labels,
    colors,
    legend: {
      show: true,
      position: 'bottom',
      fontFamily: 'Outfit',
      fontSize: '13px',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Orders',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6B7280',
              formatter: (w) =>
                String(w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Orders by Status</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Distribution of all orders</p>
      </div>

      {series.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
          No order data yet
        </div>
      ) : (
        <Chart options={options} series={series} type="donut" height={260} />
      )}
    </div>
  )
}