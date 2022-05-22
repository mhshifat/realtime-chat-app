import { Request, Response } from "express";
import { hashStringForAccountActivation } from "../../../libs";
import { SuccessResponses } from "../../../utils";
import { UserServices } from "./services";

export const UserController = {
	async createUser(req: Request, res: Response) {
		await UserServices.createUser(req.body);
		const hash = hashStringForAccountActivation({ email: req.body.email });
		return SuccessResponses(
			res,
			{
				hash,
			},
			{
				statusCode: 201,
				log: `[SYSTEM] => New User created for ${req.body.email}`,
			}
		);
	},
	async getFriends(req: Request, res: Response) {
    const { id } = req.params;
		const results = await UserServices.find({});
		return SuccessResponses(
			res,
			results,
			{
				statusCode: 200,
				log: `[SYSTEM] => Got friends for ${req.params.id}`,
			}
		);
	},
};
