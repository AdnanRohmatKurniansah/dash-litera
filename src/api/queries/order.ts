import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Order } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseOrdersParams {
  page?: number
  limit?: number
}

export function useOrders({ page = 1, limit = 10 }: UseOrdersParams = {}) {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useOrderDetail(id: string) {
  return useQuery<{ data: Order }>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useProcessOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.put(API_ENDPOINTS.ORDERS.PROCESS(orderId))
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
      return res
    },
  })
}

export function useOrderDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      return res
    },
  })
}