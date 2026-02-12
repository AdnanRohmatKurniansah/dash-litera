import Label from '../../../../components/ui/Label'
import Input from '../../../../components/ui/InputField'
import Button from '../../../../components/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldError } from 'react-hook-form'
import { BookImageUpdateSchema } from '../../../../lib/schemas/book.schema'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useBookImagesDetail, useBookImagesUpdate } from '../../../../api/queries/book-images'
import { useEffect, useState } from 'react'

const UpdateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const updateBookImage = useBookImagesUpdate()
  const { data } = useBookImagesDetail(id!)

  const [preview, setPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, formState: { errors },} = useForm({
    resolver: zodResolver(BookImageUpdateSchema),
  })

  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title,
        image_url: undefined,
      })

      if (data.data.image_url) {
        setPreview(data.data.image_url)
      }
    }
  }, [data, reset])

  const imageFile = watch('image_url')

  useEffect(() => {
    if (imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0]
      const url = URL.createObjectURL(file)
      setPreview(url)

      return () => URL.revokeObjectURL(url)
    }
  }, [imageFile])

  const handleSave = handleSubmit((formDataValues) => {
    if (!id) return

    const formData = new FormData()
    formData.append('title', formDataValues.title || '')

    if (
      formDataValues.image_url instanceof FileList &&
      formDataValues.image_url.length > 0
    ) {
      formData.append('image_url', formDataValues.image_url[0])
    }

    updateBookImage.mutate({ id, formData },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          navigate(`/dashboard/book/edit/${data?.data.bookId}`)
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message)
          } else {
            toast.error('Something went wrong')
          }
        },
      }
    )
  })

  return (
    <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}  >
      <div className="col-span-12">
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" {...register('title')}  placeholder="Enter book's image title"/>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="col-span-12">
        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" width={150} height={150} className="rounded object-cover" />
          </div>
        )}
        <Label htmlFor="image_url">Image (optional)</Label>
        <Input id="image_url" type="file" accept="image/*" {...register('image_url')} />
        {errors.image_url &&
          typeof errors.image_url === 'object' &&
          'message' in errors.image_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors.image_url as FieldError).message}
            </p>
          )}
      </div>
      <div className="col-span-12 flex justify-end gap-3 mt-3">
        <Button type="button" size="sm" variant="outline" onClick={() => navigate(-1)} disabled={updateBookImage.isPending} >
          Cancel
        </Button>
        <Button size="sm" type="submit" disabled={updateBookImage.isPending}>
          {updateBookImage.isPending ? 'Updating...' : 'Update Book Image'}
        </Button>
      </div>
    </form>
  )
}

export default UpdateForm