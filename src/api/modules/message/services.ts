import { FilterQuery } from "mongoose";
import { sendMailThroughNodemailer, hashPassword, Logger } from "../../../libs";
import { CreateMessageFormValues, MessageDocument } from "../../../utils";
import { AuthServices } from "../auth/services";
import { MessageModal } from './model';

export const MessageServices = {
  async find(query: FilterQuery<MessageDocument>, sort?: any) {
    const docs = await MessageModal.find(query).sort(sort).populate(["receiver", "sender"]);
    return docs;
  },
  async findById(id: MessageDocument["_id"]) {
    const doc = await MessageModal.findById(id);
    return doc;
  },
  async findByIdOrFail(id: MessageDocument["_id"]) {
    const doc = await MessageModal.findById(id);
    if (!doc) throw new Error("404:-Message not found");
    return doc;
  },
  async findByWhereOrFail(where: FilterQuery<MessageDocument>) {
    const doc = await MessageModal.findOne(where);
    if (!doc) throw new Error("404:-Message not found");
    return doc;
  },
  async updateDocument(id: MessageDocument["_id"], body: Partial<MessageDocument>) {
    const doc = await MessageServices.findByIdOrFail(id);
    doc.set(body);
    return await doc.save();
  },
  async createMessage({ ...body }: CreateMessageFormValues) {
    const newDoc = await MessageModal.create(body);
    return newDoc;
  },
}