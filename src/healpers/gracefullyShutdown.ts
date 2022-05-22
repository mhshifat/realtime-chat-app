import { Server } from "http";
import { closeDatabaseConnection } from "../loaders/mongoose";
import { Logger } from './../libs';

export default function gracefullyShutdown(signal: string, server: Server) {
  return process.on(signal, () => {
    closeDatabaseConnection();
    Logger.info("✔ Closed database connection.");
    server.close();
    Logger.info("✔ Closed server connection.");
    process.exit(0);
  })
}