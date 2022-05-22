import { NextFunction, Request, Response } from "express";
import { FailureResponses } from "./index";

export function asyncCatchHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next)?.catch?.((err: Error) => {
    const [statusCode, customErrorMessage] = err.message.split(":-");
    const msg = customErrorMessage || err?.message || "Something went wrong, please try again later";
    const error = new Error(msg);
    return FailureResponses(res, error, {
      statusCode: customErrorMessage ? +statusCode : 500,
    })
  })
}