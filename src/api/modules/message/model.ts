import { model, Schema } from "mongoose";
import { MessageDocument } from "../../../utils";

const document = new Schema<MessageDocument>({
  body: {
    type: String,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {
  timestamps: true,
});

export const MessageModal = model("Message", document);
