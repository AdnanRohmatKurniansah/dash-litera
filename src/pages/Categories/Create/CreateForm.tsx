import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError, useForm } from 'react-hook-form'
import { CategoryCreateInput, CategoryCreateSchema } from '../../../lib/schemas/category.schema'
import { useNavigate } from 'react-router'
import { useCategoriesCreate } from '../../../api/queries/categories'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

const CreateForm = () => {
  const navigate = useNavigate()
  const createCategory = useCategoriesCreate()
  const [preview, setPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, formState: { errors }} = useForm<CategoryCreateInput>({
    resolver: zodResolver(CategoryCreateSchema),
  })

  const imageFile = watch("image_url")

  useEffect(() => {
    if (imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleSave = handleSubmit((data) => {
    const formData = new FormData()
    formData.append("name", data.name || "")

    if (data.image_url instanceof FileList && data.image_url.length > 0) {
      formData.append("image_url", data.image_url[0]) 
    }

    createCategory.mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.message)
        reset()
        navigate('/dashboard/book/category')
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  })


  return (
    <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}>
        <div className='md:col-span-12'>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" {...register("name")} placeholder="Enter category's name"/>
            {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                </p>
            )}
        </div>
        <div className='md:col-span-12'>
            {preview && (
                <div className="col-span-2 flex justify-start">
                   <img src={preview} alt="Preview" width={150} height={150}  className="rounded object-cover"/>
                </div>
            )}
            <Label htmlFor="image_url">Image </Label>
            <Input id="image_url" type="file" accept="image/*" {...register("image_url")} placeholder="Enter category's image"/>
            {errors.image_url && typeof errors.image_url === 'object' && 'message' in errors.image_url && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {(errors.image_url as FieldError).message}
                </p>
            )}
        </div>
        <div className="md:col-span-12 flex justify-end gap-3 mt-3">
            <Button type="button" size="sm" variant="outline" onClick={() => navigate(-1)} disabled={createCategory.isPending}>
                Cancel
            </Button>
            <Button size="sm" type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? "Adding..." : "Add New"}
            </Button>
        </div>
    </form>
  )
}

export default CreateForm