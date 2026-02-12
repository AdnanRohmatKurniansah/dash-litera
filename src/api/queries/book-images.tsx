import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookImage } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseBookImagesParams {
  page?: number
  limit?: number
}

export function useBookImages(bookId: string, { page = 1, limit = 10 }: UseBookImagesParams = {}) {
  return useQuery({
    queryKey: ['book_images', bookId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOK_IMAGES.LIST(bookId), {
        params: { page, limit }
      })
      return data
    },
    staleTime: 30000, 
    enabled: !!bookId,
  })
}

export function useBookImagesDetail(id: string) {
  return useQuery<{ data: BookImage }>({
    queryKey: ['book_image', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOK_IMAGES.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useBookImagesCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ bookId, formData }: { bookId: string; formData: FormData}) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOK_IMAGES.CREATE(bookId), formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book_images'] })
      return res
    },
  })
}

export function useBookImagesUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData}) => {
      const response = await apiClient.put(API_ENDPOINTS.BOOK_IMAGES.UPDATE(id), formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book_images'] })
      queryClient.invalidateQueries({ queryKey: ['book_image'] })
      return res
    },
  })
}

export function useBookImagesDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.BOOK_IMAGES.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book_images'] })
      return res
    },
  })
}