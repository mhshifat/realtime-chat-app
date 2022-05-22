import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Input } from '../common'
import { useCallback } from 'react'
import { ButtonVariants } from '../common/Button'
import { useMutation } from 'react-query';
import { API } from '../../api'
import { sendPromiseToastMessage } from '../../lib'
import { LOCAL_STORAGE_NAMES, ROUTE_PATHS } from '../../constants'
import { useAuth } from '../../providers/Auth'
import { useRouter } from 'next/router'

export interface ActivateAccountFormProps {}
export interface ActivateAccountFormValues {
  code: string
}

const schema = yup
  .object()
  .shape({
    code: yup.string().required(),
  })
  .required()
export default function ActivateAccountForm({}: ActivateAccountFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateAccountFormValues>({
    resolver: yupResolver(schema),
  })
  const { mutateAsync: userAccountActivate } = useMutation(API.AUTH.ACTIVATE_ACCOUNT);
  const handleUserAccountActivate = useCallback(async (formValues: ActivateAccountFormValues) => {
    const { token, user } = await sendPromiseToastMessage(
      userAccountActivate(formValues),
      "Activating",
      "Successfully activated your account"
    )
    await login?.({ token, user });
    if (token && user) {
      localStorage.removeItem(LOCAL_STORAGE_NAMES.ACCOUNT_ACTIVATION_EMAIL_FOR);
    }
    router.push(ROUTE_PATHS.DASHBOARD);
  }, [])

  return (
    <form className="w-full" onSubmit={handleSubmit(handleUserAccountActivate)}>
      <Input
        type="text"
        label="Code"
        required
        {...register('code')}
        error={errors.code?.message}
      />
      <Button full type="submit" variant={ButtonVariants.primary}>
        Submit
      </Button>
    </form>
  )
}
