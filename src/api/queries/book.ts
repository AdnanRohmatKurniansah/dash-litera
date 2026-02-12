import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Book } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseBooksParams {
  page?: number
  limit?: number
}

export function useBooks({ page = 1, limit = 10 }: UseBooksParams = {}) {
  return useQuery({
    queryKey: ['books', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useBooksDetail(id: string) {
  return useQuery<{ data: Book }>({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useBooksCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOKS.CREATE, formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      return res
    },
  })
}

export function useBooksUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData}) => {
      const response = await apiClient.put(API_ENDPOINTS.BOOKS.UPDATE(id), formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book'] })
      return res
    },
  })
}

export function useBooksDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.BOOKS.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      return res
    },
  })
}