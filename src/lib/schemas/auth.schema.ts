import { z } from 'zod'

export const AdminLoginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(70, 'Username must be less than 70 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

export const AdminProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150).optional(),
  phone: z.string().max(30, 'Max Character 30').optional(),
  profile: z.any().optional().nullable()
})

export const AdminChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Old Password must be at least 6 characters'),
  new_password: z.string().min(6, 'New Password must be at least 6 characters')
})

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>
export type AdminProfileInput = z.infer<typeof AdminProfileSchema>
export type AdminChangePasswordInput = z.infer<typeof AdminChangePasswordSchema>