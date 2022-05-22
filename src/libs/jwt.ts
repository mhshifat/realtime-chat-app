import jwt from "jsonwebtoken";
import { AccountActivationJwtPayload, UserAuthJwtPayload, UserDocument } from "../utils";

const { JWT_SECRET = "" } = process.env;
export const hashStringForAccountActivation = (payload: AccountActivationJwtPayload) => jwt.sign(payload, JWT_SECRET);
export const parseAccountActivationHash = <TData>(str: string): Promise<TData> => new Promise((resolve, reject) => {
  try {
    const data = jwt.verify(str, JWT_SECRET);
    resolve(data as TData);
  } catch (err) {
    reject(new Error("Invalid token!"));
  }
});
export const hashPayloadForUserAuthentication = (payload: UserAuthJwtPayload, password: string) => jwt.sign(payload, JWT_SECRET + password);
export const parsePayloadForUserAuthentication = <TData>(str: string, password: string): Promise<TData> => new Promise((resolve, reject) => {
  try {
    const data = jwt.verify(str, JWT_SECRET + password);
    resolve(data as TData);
  } catch (err) {
    reject(new Error("Invalid token!"));
  }
});