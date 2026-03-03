import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseReviewsParams {
  page?: number
  limit?: number
}

export function useReviews({ page = 1, limit = 10 }: UseReviewsParams = {}) {
  return useQuery({
    queryKey: ['reviews', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useReviewDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      return res
    },
  })
}