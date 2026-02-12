import { z } from 'zod'

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  image_url: z.any().refine((files) => files?.length != 0, "Image is required"),
})

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80).optional(),
  image_url: z.any().optional().nullable()
})

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>