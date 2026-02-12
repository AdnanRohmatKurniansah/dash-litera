import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { AdminUpdateInput, AdminUpdateSchema } from '../../../lib/schemas/admin.schema'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useAdminDetail, useAdminUpdate } from '../../../api/queries/admin'
import Select from '../../../components/ui/Select'

const UpdateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const updateAdmin = useAdminUpdate()
  const { data } = useAdminDetail(id!)

  const roleOptions = [
    { value: 'Staff', label: 'Staff' },
    { value: 'Superadmin', label: 'Superadmin' },
  ]

  const { register, handleSubmit, control, formState: { errors }} = useForm<AdminUpdateInput>({
    resolver: zodResolver(AdminUpdateSchema),
    values: {
      name: data?.data?.name || '',
      username: data?.data?.username || '',
      email: data?.data?.email || '',
      role: data?.data?.role || '',
      password: '',
    },
  })

  const handleSave = handleSubmit((formData) => {
    if (!id) return
    
    updateAdmin.mutate(
      { id, data: formData },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          navigate('/dashboard/admin')
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message)
          } else {
            toast.error("Something went wrong")
          }
        },
      }
    )
  })

  return (
    <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}>
        <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" {...register("name")} placeholder="Enter admin's name"/>
            {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                </p>
            )}
        </div>
        <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" {...register("username")} placeholder="Enter admin's username" />
            {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.username.message}
                </p>
            )}
        </div>
        <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter admin's email" />
            {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                </p>
            )}
        </div>
        <div>
            <Label htmlFor="role">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  options={roleOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.role.message}
                </p>
            )}
        </div>
        <div className="md:col-span-2">
            <Label htmlFor="password">Password (leave blank to keep current)</Label>
            <Input id="password" type="password" {...register("password")} placeholder="Enter new password or leave blank" />
            {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                </p>
            )}
        </div>
        <div className="md:col-span-2 flex justify-end gap-3 mt-3">
            <Button type="button" size="sm" variant="outline" onClick={() => navigate(-1)} disabled={updateAdmin.isPending}>
                Cancel
            </Button>
            <Button size="sm" type="submit" disabled={updateAdmin.isPending}>
                {updateAdmin.isPending ? "Updating..." : "Update Admin"}
            </Button>
        </div>
    </form>
  )
}

export default UpdateForm