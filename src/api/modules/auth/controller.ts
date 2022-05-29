import { Request, Response } from "express"
import { DataFormatter, DataFormatterTypes, LogFormatterType, SuccessResponses } from "../../../utils"
import { UserServices } from "../user/services";
import { AuthServices } from "./services";

export const AuthController = {
  async me(req: Request, res: Response) {
    const user = (req as any).user;
    const token = user ? await AuthServices.generateToken(user) : null;
    return SuccessResponses(res, user ? {
      user: DataFormatter(user).format(DataFormatterTypes.User),
      token
    } : null);
  },
  async login(req: Request, res: Response) {
    const { user, token } = await AuthServices.login(req.body);
    return SuccessResponses(res, {
      user: DataFormatter((user as any)._doc).format(DataFormatterTypes.User),
      token
    }, {
      log: `[SYSTEM] => ${req.body.email} Logged in to the website.`
    });
  },
  async resendAccountActivationCode(req: Request, res: Response) {
    const doc = await AuthServices.resendAccountActivationCode(req.body);
    return SuccessResponses(res, {}, {
      log: `[SYSTEM] => Resent account activation code for ${doc.email}`
    });
  },
  async activateAccount(req: Request, res: Response) {
    const { user, token } = await AuthServices.activateAccount(req.body);
    return SuccessResponses(res, {
      user: DataFormatter((user as any)._doc).format(DataFormatterTypes.User),
      token
    }, {
      log: `[SYSTEM] => Account activated for ${user.email}`
    });
  },
  async forgotPassword(req: Request, res: Response) {
    await AuthServices.forgotPassword(req.body.email);
    return SuccessResponses(res, {}, {
      log: `[SYSTEM] => Forgot password email sent for ${req.body.email}`
    });
  },
}