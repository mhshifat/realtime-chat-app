import { Router } from "express";
import { asyncCatchHandler } from "../../../utils";
import { parseAuthUser, validateRequest } from "../../middlewares";
import { MessageController } from "./controller";
import { createMessageValidation, updateMessageValidation } from "./validations";

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

MessageRouter.route("/:id")
  .patch(
    [parseAuthUser, validateRequest(updateMessageValidation)],
    asyncCatchHandler(MessageController.updateMessage)
  );

MessageRouter.route("/last_message")
  .get(
    [parseAuthUser],
    asyncCatchHandler(MessageController.getLastMessage)
  );
