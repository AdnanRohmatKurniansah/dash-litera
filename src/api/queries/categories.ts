import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseCategoriesParams {
  page?: number
  limit?: number
}

export function useCategories({ page = 1, limit = 10 }: UseCategoriesParams = {}) {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useCategoriesDetail(id: string) {
  return useQuery<{ data: Category }>({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useCategoriesCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      return res
    },
  })
}

export function useCategoriesUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData}) => {
      const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category'] })
      return res
    },
  })
}

export function useCategoriesDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      return res
    },
  })
}