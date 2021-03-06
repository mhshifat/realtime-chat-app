import { Request, Response } from "express";
import { hashStringForAccountActivation } from "../../../libs";
import { SuccessResponses } from "../../../utils";
import { MessageServices } from "./services";

export const MessageController = {
	async getMessages(req: Request, res: Response) {
    const { receiver } = req.query;
		const messages = await MessageServices.find({ $or: [{ sender: (req as any).user._id, receiver }, { sender: receiver, receiver: (req as any).user._id }] });
		return SuccessResponses(
			res,
			messages,
			{
				statusCode: 200,
				log: `[SYSTEM] => Messages got for ${receiver} by ${(req as any).user._id}`,
			}
		);
	},
  async getLastMessage(req: Request, res: Response) {
    const { receiver } = req.query;
    const messages = await MessageServices.find({ $or: [{ sender: (req as any).user._id, receiver }, { sender: receiver, receiver: (req as any).user._id }] }, { createdAt: -1 });
    return SuccessResponses(
      res,
      messages[0],
      {
        statusCode: 200,
        log: `[SYSTEM] => Last Message got for ${receiver} by ${(req as any).user._id}`,
      }
    );
  },
	async createMessage(req: Request, res: Response) {
		const newDoc = await MessageServices.createMessage({
      ...req.body,
      sender: (req as any).user._id
    });
		return SuccessResponses(
			res,
			newDoc,
			{
				statusCode: 201,
				log: `[SYSTEM] => New Message created for ${req.body.receiver} by ${req.body.sender}`,
			}
		);
	},
  async updateMessage(req: Request, res: Response) {
    const updatedDoc = await MessageServices.updateDocument(req.params.id, req.body);
    return SuccessResponses(
      res,
      updatedDoc,
      {
        statusCode: 201,
        log: `[SYSTEM] => Message updated for ${req.body.receiver} by ${req.body.sender}`,
      }
    );
  },
};
