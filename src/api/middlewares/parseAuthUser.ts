import { NextFunction, Request, Response } from "express";
import { parsePayloadForUserAuthentication } from "../../libs";
import jwt from 'jsonwebtoken';
import { UserAuthJwtPayload } from "../../utils";
import { UserServices } from "../modules/user/services";
import { AuthServices } from "../modules/auth/services";

export default async function parseAuthUser(req: Request, res: Response, next: NextFunction) {
  const finish = () => {
    (req as any).user = null;
    next();
  }
  try {
    const bearerToken = req.get("Authorization");
    if (!bearerToken) return finish();
    const token = bearerToken.replace("Bearer ", "");
    if (!token) return finish();
    const decodedToken = jwt.decode(token);
    if (!decodedToken || typeof decodedToken === "string" || !("uid" in decodedToken)) return finish();
    const user = await UserServices.findById(decodedToken.uid);
    if (!user) return finish();
    const auth = await AuthServices.findById(user.auth);
    if (!auth) return finish();
    const { uid } = await parsePayloadForUserAuthentication<UserAuthJwtPayload>(token, auth.password);
    if (!uid) return finish();
    (req as any).user = (user as any)._doc;
    next();
  } catch (err) {
    finish();
  }
}