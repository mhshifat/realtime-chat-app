import { model, Schema } from "mongoose";
import { accountActivationEmailTemplate, UserDocument } from "../../../utils";
import { AuthServices } from "../auth/services";
import { sendMailThroughNodemailer, Logger } from './../../../libs';
import { UserServices } from "./services";

const document = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  auth: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
    required: false
  },
}, {
  timestamps: true,
});

export const UserModal = model("User", document);
