import { http } from "../lib"
import { LoginFormValues } from "../components/forms/Login"
import { AccountActivationFormValues } from "../pages/activate-account"
import { ActivateAccountFormValues } from "../components/forms/ActivateAccount"
import { LOCAL_STORAGE_NAMES } from "../constants"
import { ForgotPasswordFormValues } from "../components/forms/ForgotPassword"

export const GET_ME = ({ queryKey }: any) => {
  const [_, args] = queryKey;
  return http({
    url: "/auth",
    params: args,
    method: "GET"
  })
}
export const LOGIN = (values: LoginFormValues) => {
  return http({
    url: "/auth",
    data: values,
    method: "POST"
  })
}
export const RESEND_ACCOUNT_ACTIVATION_CODE = (values: AccountActivationFormValues) => {
  return http({
    url: "/auth/activate/resend",
    data: values,
    method: "POST"
  })
}
export const FORGOT_PASSWORD = (values: ForgotPasswordFormValues) => {
  return http({
    url: "/auth/forgot-password",
    data: values,
    method: "POST"
  })
}
export const ACTIVATE_ACCOUNT = (values: ActivateAccountFormValues) => {
  const hash = localStorage.getItem(LOCAL_STORAGE_NAMES.ACCOUNT_ACTIVATION_EMAIL_FOR);
  return http({
    url: "/auth/activate",
    data: {
      ...values,
      hash
    },
    method: "POST"
  })
}