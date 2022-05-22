import Joi from "joi";
import { ActivateAccountFormValues, ForgotPasswordFormValues, LoginFormValues, ResendAccountActivationFormValues } from "../../../utils";

export const loginValidation = Joi.object<LoginFormValues>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const resendAccountValidation = Joi.object<ResendAccountActivationFormValues>({
  hash: Joi.string().required(),
})

export const forgotPasswordValidation = Joi.object<ForgotPasswordFormValues>({
  email: Joi.string().email().required(),
})

export const activateAccountValidation = Joi.object<ActivateAccountFormValues>({
  code: Joi.string().required(),
  hash: Joi.string().required(),
})