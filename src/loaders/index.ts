import http, { Server } from "http";
import gracefullyShutdown from "../healpers/gracefullyShutdown";
import { Logger } from "../libs";
import { LoadersConfig } from "../utils";
import createServer from "./express";
import connectDatabase from "./mongoose";
import { initSocket } from './../libs/socket';

export default (function Loaders() {
  return {
    async loadDatabase(uri: LoadersConfig["mongo_string"]) {
      try {
        const mongooseConn = await connectDatabase(uri);
        Logger.info("📦 Database Connected...");
        return mongooseConn;
      } catch (err) {
        Logger.error(err, "🌋 Database connection failed...");
      }
    },
    async loadExpress(port: LoadersConfig["port"]) {
      try {
        const server = await createServer();
        Logger.info("📦 ExpressJS Loaded...");
        const serverRes = server.listen(port);
        await this.loadSocket(serverRes);
        const SIGNALS = ["SIGINT", "SIGTERM"];
        SIGNALS.forEach(signal => gracefullyShutdown(signal, serverRes))
        return serverRes;
      } catch (err) {
        Logger.error(err, "🌋 ExpressJS failed to load...");
      }
    },
    async loadSocket(server: Server) {
      try {
        const client = initSocket(server);
        Logger.info("📦 SocketIo Loaded...");
        return client;
      } catch (err) {
        Logger.error(err, "🌋 SocketIo failed to load...");
      }
    },
    async load(config: LoadersConfig) {
      return Promise.all([
        await this.loadDatabase(config.mongo_string),
        await this.loadExpress(config.port),
      ]);
    }
  }
})()