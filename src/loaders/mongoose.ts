import mongoose from "mongoose";
import { LoadersConfig } from './../utils';

export default async function connectDatabase(uri: LoadersConfig["mongo_string"]) {
  return mongoose.connect(uri)
}

export function closeDatabaseConnection() {
  return mongoose.connection.close();
}