import Joi from "joi";
import { CreateUserFormValues } from "../../../utils";
import { AuthDocumentLoggedInThrough } from './../../../utils/types';

export const createUserValidation = Joi.object<CreateUserFormValues>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  type: Joi.string().valid(...Object.values(AuthDocumentLoggedInThrough)).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})