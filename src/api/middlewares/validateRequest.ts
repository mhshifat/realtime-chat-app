import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { FailureResponses } from "../../utils";

export default function validateRequest<TData>(schema: Joi.ObjectSchema<TData>) {
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validateAsync(req.body, {
				abortEarly: false,
			});
      return next();
    } catch (err: any) {
      const errors: { path: string, message: string }[] = err && err.details ? err.details.map((err: any) => ({
        path: err.path[0],
        message: err.message,
      })) : [];
      return FailureResponses(res, new Error("Invalid fields"), {
        statusCode: 422,
        errors,
      });
    }
  }
}