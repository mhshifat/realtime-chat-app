import { Router } from "express";
import { asyncCatchHandler } from "../../../utils";
import { validateRequest } from "../../middlewares";
import { AuthController } from "./controller";
import { activateAccountValidation, forgotPasswordValidation, loginValidation, resendAccountValidation } from "./validations";

export const AuthRouter = Router();

AuthRouter.route("/")
  .get(
    asyncCatchHandler(AuthController.me)
  )
  .post(
    [validateRequest(loginValidation)],
    asyncCatchHandler(AuthController.login)
  );
AuthRouter.route("/forgot-password").post(
  [validateRequest(forgotPasswordValidation)],
  asyncCatchHandler(AuthController.forgotPassword)
);
// TODO: Fix login redirect after account activation...
AuthRouter.route("/activate").post(
	[validateRequest(activateAccountValidation)],
	asyncCatchHandler(AuthController.activateAccount)
);
AuthRouter.route("/activate/resend").post(
	[validateRequest(resendAccountValidation)],
	asyncCatchHandler(AuthController.resendAccountActivationCode)
);
