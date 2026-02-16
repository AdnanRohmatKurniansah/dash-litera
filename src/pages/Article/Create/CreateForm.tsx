import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import RichTextEditor from '../../../components/ui/RichTextEditor'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError, useForm, Controller } from 'react-hook-form'
import { ArticleCreateInput, ArticleCreateSchema } from '../../../lib/schemas/article.schema'
import { useNavigate } from 'react-router'
import { useArticleCreate } from '../../../api/queries/article'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

const CreateForm = () => {
  const navigate = useNavigate()
  const createArticle = useArticleCreate()
  const [preview, setPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, control, formState: { errors }} = useForm<ArticleCreateInput>({
    resolver: zodResolver(ArticleCreateSchema),
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
    formData.append("title", data.title || "")
    formData.append("published_at", data.published_at || "")
    formData.append("content", data.content || "")

    if (data.image_url instanceof FileList && data.image_url.length > 0) {
      formData.append("image_url", data.image_url[0]) 
    }

    createArticle.mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.message)
        reset()
        navigate('/dashboard/article')
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
            <Label htmlFor="title">Title</Label>
            <Input id="title" type="text" {...register("title")} placeholder="Enter article's title"/>
            {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                </p>
            )}
        </div>
        <div className='md:col-span-12'>
            <Label htmlFor="published_at">Published At</Label>
            <Input id="published_at" type="date" {...register("published_at")} placeholder="Enter published date" />
            {errors.published_at && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.published_at.message}
                </p>
            )}
        </div>
        <div className='md:col-span-12'>
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
        <div>
            {preview && (
                <div className="col-span-2 flex justify-start mb-2">
                   <img src={preview} alt="Preview" width={150} height={150}  className="rounded object-cover"/>
                </div>
            )}
            <Label htmlFor="image_url">Image </Label>
            <Input id="image_url" type="file" accept="image/*" {...register("image_url")} placeholder="Enter article's image"/>
            {errors.image_url && typeof errors.image_url === 'object' && 'message' in errors.image_url && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {(errors.image_url as FieldError).message}
                </p>
            )}
        </div>
        <div className="md:col-span-12 flex justify-end gap-3 mt-3">
            <Button type="button" size="sm" variant="outline" onClick={() => navigate(-1)} disabled={createArticle.isPending}>
                Cancel
            </Button>
            <Button size="sm" type="submit" disabled={createArticle.isPending}>
                {createArticle.isPending ? "Adding..." : "Add New"}
            </Button>
        </div>
    </form>
  )
}

export default CreateForm