import express from "express";
import morgan from "morgan";
import cors from "cors";
import Routes from "../api";
import morganConfigWithLogger from "./morgan";

export default async function createServer() {
  const app = express();

  app.use([
    cors(),
    morgan(morganConfigWithLogger as any),
    express.json({ limit: "5mb" }),
  ]);

  app.get("/", (req, res) => res.status(200).send("Hello from API"));
  app.use("/api/v1", Routes())

  return app;
}