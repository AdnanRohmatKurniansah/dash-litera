import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Admin } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import { AdminCreateInput, AdminUpdateInput } from '../../lib/schemas/admin.schema'


interface UseAdminsParams {
  page?: number
  limit?: number
}

export function useAdmins({ page = 1, limit = 10 }: UseAdminsParams = {}) {
  return useQuery({
    queryKey: ['admins', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMINS.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useAdminDetail(id: string) {
  return useQuery<{ data: Admin }>({
    queryKey: ['admin', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADMINS.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useAdminCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: AdminCreateInput) => {
      const response = await apiClient.post(API_ENDPOINTS.ADMINS.CREATE, data)
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      return res
    },
  })
}

export function useAdminUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AdminUpdateInput}) => {
      const response = await apiClient.put(API_ENDPOINTS.ADMINS.UPDATE(id), data)
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      return res
    },
  })
}

export function useAdminDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.ADMINS.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      return res
    },
  })
}