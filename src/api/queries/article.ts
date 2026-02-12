import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Article } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseArticlesParams {
  page?: number
  limit?: number
}

export function useArticles({ page = 1, limit = 10 }: UseArticlesParams = {}) {
  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ARTICLES.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useArticleDetail(id: string) {
  return useQuery<{ data: Article }>({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ARTICLES.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useArticleCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post(API_ENDPOINTS.ARTICLES.CREATE, formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      return res
    },
  })
}

export function useArticleUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData}) => {
      const response = await apiClient.put(API_ENDPOINTS.ARTICLES.UPDATE(id), formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article'] })
      return res
    },
  })
}

export function useArticleDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.ARTICLES.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      return res
    },
  })
}