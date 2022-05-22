import { Router } from "express";
import { asyncCatchHandler } from "../../../utils";
import { parseAuthUser, validateRequest } from "../../middlewares";
import { MessageController } from "./controller";
import { createMessageValidation } from "./validations";

export const MessageRouter = Router();

MessageRouter.route("/")
  .get(
    [parseAuthUser],
    asyncCatchHandler(MessageController.getMessages)
  )
  .post(
    [parseAuthUser, validateRequest(createMessageValidation)],
    asyncCatchHandler(MessageController.createMessage)
  );
