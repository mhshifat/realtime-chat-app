import { Router } from "express";
import { asyncCatchHandler } from "../../../utils";
import { validateRequest } from "../../middlewares";
import { UserController } from "./controller";
import { createUserValidation } from "./validations";

export const UserRouter = Router();

UserRouter.route("/").post(
	[validateRequest(createUserValidation)],
	asyncCatchHandler(UserController.createUser)
);

// TODO: Needs to work here more.
UserRouter.route("/:id/friends").get(
	asyncCatchHandler(UserController.getFriends)
);
