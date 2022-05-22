import { Router } from "express";
import { parseAuthUser } from "./middlewares";
import { API } from "./modules";

export default function Routes() {
  const router = Router();

  router.use(parseAuthUser)

  Object.keys(API).forEach((key) => router.use(key, API[key as keyof (typeof API)]));
  
  return router;
};