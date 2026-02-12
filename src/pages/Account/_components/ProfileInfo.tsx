  "use client"

  import { useForm } from "react-hook-form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { useEffect, useState } from "react"
  import { AdminProfileInput, AdminProfileSchema } from "../../../lib/schemas/auth.schema"
  import { useModal } from "../../../hooks/useModal"
  import { Modal } from "../../../components/ui/Modal"
  import Label from "../../../components/ui/Label"
  import Input from "../../../components/ui/InputField"
  import Button from "../../../components/ui/Button"
  import { useAuth } from "../../../context/AuthContext"
  import { useUpdateProfile } from "../../../api/queries/auth"
  import ChangePassword from "./ChangePassword"
import { toast } from "sonner"
import { AxiosError } from "axios"

  const ProfileInfo = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const [preview, setPreview] = useState<string | null>(null)

    const { admin, isLoading } = useAuth()
    const updateProfile = useUpdateProfile()

    const { register, handleSubmit, reset, formState: { errors } ,watch } = useForm<AdminProfileInput>({
      resolver: zodResolver(AdminProfileSchema),
    })

    const profileFile = watch("profile")

    useEffect(() => {
      if (profileFile instanceof FileList && profileFile.length > 0) {
        const file = profileFile[0];
        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
      }
    }, [profileFile]);


    const handleSave = handleSubmit((data) => {
      const formData = new FormData()
      formData.append("name", data.name || "")
      formData.append("phone", data.phone || "")

      if (data.profile instanceof FileList && data.profile.length > 0) {
        formData.append("profile", data.profile[0]) 
      }

      updateProfile.mutate(formData, {
        onSuccess: (res) => {
          toast.success(res.message)
          reset(data)
          closeModal()
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

    const handleClose = () => {
      setPreview(null);
      closeModal();
    };

    if (isLoading) return null

    if (!admin) return null

    return (
      <div className="space-y-6">
        <div className="p-5 border rounded-2xl">
          <div className="flex gap-6 items-center">
            <img
              src={admin.profile || "/images/avatar.png"}
              width={80}
              height={80}
              className="rounded-full"
              alt="user"
            />

            <div>
              <h4 className="font-semibold">{admin.name}</h4>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>
          </div>
        </div>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    First Name
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {admin.name}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {admin.email}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {admin.role}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {admin.phone || "-"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                reset({
                  name: admin.name,
                  phone: admin.phone || undefined,
                  profile: null,
                });
                setPreview(admin.profile || null);
                openModal();
              }}
              className="flex w-1/2 sm:w-full  items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              Edit
            </button>
          </div>

          <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
              <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Edit Personal Information
                </h4>
              </div>

              <form className="flex flex-col">
                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                  <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Label>First Name</Label>
                      <Input type="text" {...register("name")} />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Username</Label>
                      <Input type="text" name="username" value={admin.username} readOnly />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input type="text" name="email" value={admin.email} readOnly />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input type="text" {...register("phone")} />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {preview && (
                      <div className="col-span-2 flex justify-center">
                        <img
                          src={preview}
                          alt="Preview"
                          width={150}
                          height={150}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}

                    <div className="col-span-2">
                      <Label>Profile Photo</Label>
                      <Input type="file" accept="image/*" {...register("profile")} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <Button size="sm" variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
        {!isLoading && (
          <ChangePassword isLoading={isLoading} />
        )}
      </div>
    )
  }

  export default ProfileInfo