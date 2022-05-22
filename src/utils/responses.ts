import { response, Response } from "express";
import { Logger } from "../libs";
import { ResponsesOptions } from "./index";

export function SuccessResponses<TData>(res: Response, data: TData, options?: ResponsesOptions) {
  if (options?.log) Logger.info(options.log);
  return res.status(options?.statusCode || 200).json({
    success: true,
    result: data
  });
}

export function FailureResponses<TError extends Error>(res: Response, err: TError, options?: ResponsesOptions) {
  if (err) Logger.error(err, "Error detected!");
  return res.status(options?.statusCode || 500).json({
    success: false,
    msg: err?.message,
    ...options?.errors?.length?{ errors: options.errors }:{}
  });
}