import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Input } from '../common'
import { useCallback } from 'react'
import { ButtonVariants } from '../common/Button'
import Link from 'next/link'
import { ROUTE_PATHS } from './../../constants/routes'
import { useMutation } from 'react-query'
import { API } from './../../api';
import toast from 'react-hot-toast'
import { sendPromiseToastMessage } from '../../lib'
import { useAuth } from '../../providers/Auth'
import { useRouter } from 'next/router'

export interface LoginFormProps {}
export interface LoginFormValues {
  email: string
  password: string
}

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required()
export default function LoginForm({}: LoginFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  })
  const { mutateAsync: loginUser } = useMutation(API.AUTH.LOGIN)

  const handleUserLogin = useCallback(async (values) => {
    const { token, user } = await sendPromiseToastMessage(
      loginUser(values),
      'Processing...',
      'Successfully logged you in'
    )
    login?.({ token, user })
  }, [])

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(handleUserLogin)}>
        <Input
          type="email"
          label="Email"
          required
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          label="Password"
          required
          togglePassword
          {...register('password')}
          error={errors.password?.message}
          labelEnds={
            <Link href={ROUTE_PATHS.FORGOT_PASSWORD}>
              <a className="text-sm text-blue-600">Forgot Password?</a>
            </Link>
          }
        />
        <Button full type="submit" variant={ButtonVariants.primary}>
          Submit
        </Button>
      </form>
      <div className="flex items-center py-5">
        <span className="h-[1px] flex-1 bg-slate-400 opacity-[.7]"></span>
        <span className="mx-2 text-base font-semibold text-slate-600">OR</span>
        <span className="h-[1px] flex-1 bg-slate-400 opacity-[.5]"></span>
      </div>
      <div className="flex items-center justify-center">
        <p className="flex items-center gap-3 text-sm font-medium text-slate-600">
          Watch Demo, Login as?{' '}
          <button
            className="text-blue-600"
            onClick={() => {
              setValue('email', 'usertwo@gmail.com')
              setValue('password', 'abc123')
            }}
          >
            User Two
          </button>
          <button
            className="text-blue-600"
            onClick={() => {
              setValue('email', 'userthree@gmail.com')
              setValue('password', 'abc123')
            }}
          >
            User Three
          </button>
        </p>
      </div>
    </>
  )
}
