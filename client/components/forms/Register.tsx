import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Input } from '../common'
import { useCallback } from 'react'
import { ButtonVariants } from '../common/Button'
import { useMutation } from 'react-query'
import { API } from '../../api'
import { sendPromiseToastMessage } from '../../lib'
import { useRouter } from 'next/router'
import { LOCAL_STORAGE_NAMES, ROUTE_PATHS } from '../../constants'

export interface RegisterFormProps {}
export interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confPassword: string
}

const schema = yup
  .object()
  .shape({
    firstName: yup.string().required('first name is required'),
    lastName: yup.string().required('last name is required'),
    email: yup.string().email().required(),
    password: yup.string().required(),
    confPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'passwords must match')
      .required('confirm password is required'),
  })
  .required()
export default function RegisterForm({}: RegisterFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
  })
  const { mutateAsync: createUser, isLoading } = useMutation(API.USER.CREATE_USER)

  const handleUserRegister = useCallback(async ({ confPassword, ...formValues }: RegisterFormValues) => {
    const { hash } = await sendPromiseToastMessage(
      createUser(formValues),
      "Processing",
      "Successfully created your account, please activate your account to login. Code will expire in 5 minutes."
    )
    localStorage.setItem(LOCAL_STORAGE_NAMES.ACCOUNT_ACTIVATION_EMAIL_FOR, hash);
    router.push(ROUTE_PATHS.ACTIVATE_ACCOUNT)
  }, [])

  return (
    <form className="w-full" onSubmit={handleSubmit(handleUserRegister)}>
      <Input
        type="text"
        label="First Name"
        required
        {...register('firstName')}
        error={errors.firstName?.message}
      />
      <Input
        type="text"
        label="Last Name"
        required
        {...register('lastName')}
        error={errors.lastName?.message}
      />
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
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        type="password"
        label="Confirm Password"
        required
        {...register('confPassword')}
        error={errors.confPassword?.message}
      />
      <Button loading={isLoading} full type="submit" variant={ButtonVariants.primary}>
        Submit
      </Button>
    </form>
  )
}
