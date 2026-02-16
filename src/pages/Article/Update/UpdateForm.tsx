import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import RichTextEditor from '../../../components/ui/RichTextEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldError, Controller } from 'react-hook-form'
import { ArticleUpdateInput, ArticleUpdateSchema } from '../../../lib/schemas/article.schema'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useArticleDetail, useArticleUpdate } from '../../../api/queries/article'
import { useEffect, useState } from 'react'

const UpdateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const updateArticle = useArticleUpdate()
  const { data } = useArticleDetail(id!)

  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ArticleUpdateInput>({
    resolver: zodResolver(ArticleUpdateSchema),
  })

  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title || '',
        published_at: data.data.published_at?.split('T')[0] || '',
        content: data.data.content || '',
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
    formData.append('published_at', formDataValues.published_at || '')
    formData.append('content', formDataValues.content || '')

    if (
      formDataValues.image_url instanceof FileList &&
      formDataValues.image_url.length > 0
    ) {
      formData.append('image_url', formDataValues.image_url[0])
    }

    updateArticle.mutate({ id, formData },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          navigate('/dashboard/article')
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
    <form
      className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
      onSubmit={handleSave}
    >
      <div className="col-span-12">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          {...register('title')}
          placeholder="Enter article's title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="col-span-12">
        <Label htmlFor="published_at">Published At</Label>
        <Input
          id="published_at"
          type="date"
          {...register('published_at')}
        />
        {errors.published_at && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.published_at.message}
          </p>
        )}
      </div>

      <div className="col-span-12">
        <Label htmlFor="content">Content</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Enter article's content..."
              rows={12}
              error={!!errors.content}
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="col-span-12">
        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              width={150}
              height={150}
              className="rounded object-cover"
            />
          </div>
        )}

        <Label htmlFor="image_url">Image (optional)</Label>
        <Input
          id="image_url"
          type="file"
          accept="image/*"
          {...register('image_url')}
        />

        {errors.image_url &&
          typeof errors.image_url === 'object' &&
          'message' in errors.image_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors.image_url as FieldError).message}
            </p>
          )}
      </div>

      <div className="col-span-12 flex justify-end gap-3 mt-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={updateArticle.isPending}
        >
          Cancel
        </Button>

        <Button
          size="sm"
          type="submit"
          disabled={updateArticle.isPending}
        >
          {updateArticle.isPending ? 'Updating...' : 'Update Article'}
        </Button>
      </div>
    </form>
  )
}

export default UpdateForm