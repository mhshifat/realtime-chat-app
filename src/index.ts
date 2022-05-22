import "dotenv/config";
import Loaders from "./loaders";
import { Logger } from "./libs";
import { DataFormatter, DataFormatterTypes } from "./utils";

const {
	PORT = 5000,
	HOST = "localhost",
	NODE_ENV = "dev",
	MONGODB_URI,
} = process.env;

Loaders.load({ port: PORT, mongo_string: MONGODB_URI! }).then(() =>
	Logger.info(
		`🚀 The server is running on http://${HOST}:${PORT} on ${NODE_ENV} mode.`
	)
);
