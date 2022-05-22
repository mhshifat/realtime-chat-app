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
import { ROUTE_PATHS } from '../../constants'

export interface ForgotPasswordFormProps {}
export interface ForgotPasswordFormValues {
  email: string
}

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
  })
  .required()
export default function ForgotPasswordForm({}: ForgotPasswordFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(schema),
  })
  const { mutateAsync: forgotPassword } = useMutation(API.AUTH.FORGOT_PASSWORD)

  const handleUserForgotPassword = useCallback(async (formValues) => {
    await sendPromiseToastMessage(
      forgotPassword(formValues),
      "Processing",
      "Please check your email, we have sent you an email with necessary instruction."
    )
    router.push(ROUTE_PATHS.LOGIN);
  }, [])

  return (
    <form className="w-full" onSubmit={handleSubmit(handleUserForgotPassword)}>
      <Input
        type="email"
        label="Email"
        required
        {...register('email')}
        error={errors.email?.message}
      />
      <Button full type="submit" variant={ButtonVariants.primary}>
        Submit
      </Button>
    </form>
  )
}
