import Joi from "joi";
import { CreateMessageFormValues, MessageDocument } from './../../../utils/types';

export const createMessageValidation = Joi.object<CreateMessageFormValues>({
  receiver: Joi.string().required(),
  body: Joi.string().required(),
})

export const updateMessageValidation = Joi.object<Partial<MessageDocument>>({
  receiver: Joi.string().optional(),
  body: Joi.string().optional(),
  seen: Joi.boolean().optional(),
})