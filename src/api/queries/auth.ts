import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminChangePasswordInput, AdminLoginInput } from '../../lib/schemas/auth.schema'
import { useAuth } from '../../context/AuthContext'
import { API_ENDPOINTS } from '../endpoint'
import apiClient from '../../lib/axios'

export function useAdminLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (credentials: AdminLoginInput) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, credentials)
      return data
    },
    onSuccess: async (res) => {
      await login(res.data.access_token, true)
      return res
    }
  })
}

export function useLogout() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}


export function useUpdateProfile() {
  const { refetchProfile } = useAuth()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.ADMIN_PROFILE_UPDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: async (res) => {
      await refetchProfile()
      return res
    }
  })
}

export function useChangePassword() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: async (credentials: AdminChangePasswordInput) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.ADMIN_CHANGE_PASSWORD,
        credentials
      )
      return data
    },
    onSuccess: async (res) => {
      setTimeout(async () => {
        await logout()
      }, 2000)
      return res
    }
  })
}