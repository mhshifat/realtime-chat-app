import Joi from "joi";
import { CreateMessageFormValues } from './../../../utils/types';

export const createMessageValidation = Joi.object<CreateMessageFormValues>({
  receiver: Joi.string().required(),
  body: Joi.string().required(),
})