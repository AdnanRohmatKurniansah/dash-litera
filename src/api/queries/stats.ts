import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../endpoint'
import apiClient from '../../lib/axios'

interface DashboardStats {
  overview: {
    totalUsers: number
    totalBooks: number
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    completedOrders: number
    lowStockBooks: number
  }
  recentOrders: Array<{
    id: string
    receipt_number: string | null
    status: string
    total: number
    created_at: string
    user: {
      name: string
      email: string
    }
  }>
}

interface OrderStats {
  byStatus: Array<{
    status: string
    _count: {
      status: number
    }
  }>
  monthly: Array<{
    month: string
    count: number
    revenue: number
  }>
}

interface TopProduct {
  book: {
    id: string
    name: string
    slug: string
    image_url: string
    price: number
    discount_price: number | null
    qty: number
  }
  totalSold: number
}

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  orders: () => [...statsKeys.all, 'orders'] as const,
  topProducts: (limit?: number) => [...statsKeys.all, 'top-products', limit] as const,
  lowStock: (threshold?: number) => [...statsKeys.all, 'low-stock', threshold] as const,
}

export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean
        message: string
        data: DashboardStats
      }>(API_ENDPOINTS.STATS.DASHBOARD)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useOrderStats() {
  return useQuery({
    queryKey: statsKeys.orders(),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean
        message: string
        data: OrderStats
      }>(API_ENDPOINTS.STATS.ORDERS)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: statsKeys.topProducts(limit),
    queryFn: async () => {
      const { data } = await apiClient.get<{
        success: boolean
        message: string
        data: TopProduct[]
      }>(API_ENDPOINTS.STATS.TOP_PRODUCTS, {
        params: { limit },
      })
      return data.data
    },
    staleTime: 10 * 60 * 1000, 
  })
}

export function useLowStockBooks(threshold = 10) {
  return useQuery({
    queryKey: statsKeys.lowStock(threshold),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.STATS.LOW_STOCK, {
        params: { threshold },
      })
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}