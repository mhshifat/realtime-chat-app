import bcrypt from "bcryptjs";
import { AuthDocument } from "../utils";

export const hashPassword = async (password: AuthDocument["password"]) => bcrypt.hash(password, 10)
export const comparePassword = async (hashedPassword: AuthDocument["password"], password: AuthDocument["password"]) => bcrypt.compare(password, hashedPassword)