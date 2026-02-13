import { useState } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminLoginInput, AdminLoginSchema } from "../../../lib/schemas/auth.schema";
import { useAdminLogin } from "../../../api/queries/auth";
import Label from "../../../components/ui/Label";
import Input from "../../../components/ui/InputField";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Button from "../../../components/ui/Button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(AdminLoginSchema),
  })

  const loginMutation = useAdminLogin()

  const onSubmit = (data: AdminLoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message)
        navigate('/dashboard')
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="sm:hidden flex flex-col items-center">
            <Link to="/" className="block mb-4">
              <img
                width={250}
                height={48}
                src="/images/logo/logo.png"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input {...register('username')} name="username" placeholder="Enter your username" />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Button disabled={loginMutation.isPending} className="w-full" size="sm">
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
