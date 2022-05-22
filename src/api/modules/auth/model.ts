import { model, Schema } from "mongoose";
import { AuthDocument, AuthDocumentLoggedInThrough } from "../../../utils";

const document = new Schema<AuthDocument>({
  password: {
    type: String,
    required: true
  },
  logged_in_through: {
    type: String,
    enum: AuthDocumentLoggedInThrough,
    required: true
  },
  activation_code: {
    type: String,
    required: false
  },
  activation_code_ttl: {
    type: Number,
    required: false
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {
  timestamps: true,
});

export const AuthModal = model("Auth", document);
