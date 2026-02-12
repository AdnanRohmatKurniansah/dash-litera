import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { BookCreateSchema } from '../../../lib/schemas/book.schema'
import { useNavigate } from 'react-router'
import { useBooksCreate } from '../../../api/queries/book'
import { useCategories } from '../../../api/queries/categories'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import TextArea from '../../../components/ui/TextArea'
import Select from '../../../components/ui/Select'
import { useEffect, useState } from 'react'

const CreateForm = () => {
  const navigate = useNavigate()
  const createBooks = useBooksCreate()
  const [preview, setPreview] = useState<string | null>(null)

  const { data } = useCategories()

  const categories = data?.data || []

  const categoryOptions = (categories?.items ?? categories ?? []).map(
    (cat: { id: string; name: string }) => ({
      value: cat.id,
      label: cat.name,
    })
  )

  const { register, handleSubmit, reset, watch, control, formState: { errors },} = useForm({
    resolver: zodResolver(BookCreateSchema),
  })

  const imageFile = watch('image_url')

  useEffect(() => {
    if (imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0]
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFile])

  const handleSave = handleSubmit((data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('categoryId', data.categoryId)
    formData.append('desc', data.desc)
    formData.append('author', data.author)
    formData.append('publisher', data.publisher)
    formData.append('published_at', data.published_at)
    formData.append('language', data.language)
    formData.append('page', String(data.page))
    formData.append('length', String(data.length))
    formData.append('width', String(data.width))
    formData.append('weight', String(data.weight))
    formData.append('price', String(data.price))
    formData.append('discount_price', String(data.discount_price ?? 0))
    formData.append('qty', String(data.qty))

    if (data.image_url instanceof FileList && data.image_url.length > 0) {
      formData.append('image_url', data.image_url[0])
    }

    createBooks.mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.message)
        reset()
        navigate('/dashboard/book')
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error('Something went wrong')
        }
      },
    })
  })

  return (
    <form  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}  >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...register('name')} placeholder="Enter book's name" />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              options={categoryOptions}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.categoryId.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" type="text" {...register('author')} placeholder="Enter author name" />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="publisher">Publisher</Label>
        <Input  id="publisher" type="text" {...register('publisher')} placeholder="Enter publisher name" />
        {errors.publisher && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.publisher.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="published_at">Published At</Label>
        <Input id="published_at" type="date" {...register('published_at')} placeholder="Enter published date" />
        {errors.published_at && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.published_at.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="language">Language</Label>
        <Input id="language" type="text" {...register('language')} placeholder="e.g. English, Indonesian" />
        {errors.language && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.language.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="page">Pages</Label>
        <Input id="page" min={1} step="any" type="number" {...register('page')} placeholder="Number of pages" />
        {errors.page && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.page.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" min={0} step="any" type="number" {...register('price')} placeholder="Enter price"/>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="discount_price">Discount Price</Label>
        <Input id="discount_price" min={0} step="any" type="number" {...register('discount_price')} placeholder="Enter discount price (optional)" />
        {errors.discount_price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.discount_price.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="qty">Quantity</Label>
        <Input id="qty" type="number" step="any" min={1} {...register('qty')} placeholder="Enter stock quantity" />
        {errors.qty && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.qty.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="length">Length (cm)</Label>
        <Input id="length" type="number" step="any" min={1} {...register('length')} placeholder="Enter length" />
        {errors.length && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.length.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="width">Width (cm)</Label>
        <Input id="width" type="number" step="any" min={1} {...register('width')} placeholder="Enter width"/>
        {errors.width && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.width.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="weight">Weight (g)</Label>
        <Input id="weight" type="number" step="any" min={1} {...register('weight')} placeholder="Enter weight" />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.weight.message}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="desc">Description</Label>
        <TextArea rows={6} placeholder="Enter book's description" {...register('desc')} error={!!errors.desc} />
        {errors.desc && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.desc.message}</p>
        )}
      </div>
      <div className="md:col-span-2">
        {preview && (
          <div className="mb-3 flex justify-start">
            <img src={preview} alt="Preview" width={150} height={150} className="rounded object-cover border border-gray-200 dark:border-gray-700" />
          </div>
        )}
        <Label htmlFor="image_url">Cover Image</Label>
        <Input id="image_url" type="file" accept="image/*" {...register('image_url')} />
        {errors.image_url &&
          typeof errors.image_url === 'object' &&
          'message' in errors.image_url && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors.image_url as FieldError).message}
            </p>
          )}
      </div>
      <div className="md:col-span-12 flex justify-end gap-3 mt-3">
        <Button type="button" size="sm" variant="outline" onClick={() => navigate(-1)} disabled={createBooks.isPending}>
          Cancel
        </Button>
        <Button size="sm" type="submit" disabled={createBooks.isPending}>
          {createBooks.isPending ? 'Adding...' : 'Add Book'}
        </Button>
      </div>
    </form>
  )
}

export default CreateForm