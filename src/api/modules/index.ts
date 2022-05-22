import { AuthRouter } from "./auth";
import { UserRouter } from "./user";
import { MessageRouter } from "./message";

export const API = {
  "/auth": AuthRouter,
  "/users": UserRouter,
  "/messages": MessageRouter,
}