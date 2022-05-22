import { FilterQuery } from "mongoose";
import { sendMailThroughNodemailer, hashPassword, Logger } from "../../../libs";
import { accountActivationEmailTemplate, AuthDocument, CreateUserFormValues, UserDocument } from "../../../utils";
import { AuthServices } from "../auth/services";
import { UserModal } from './model';

const { ACCOUNT_ACTIVATION_TTL = 30000 } = process.env;
export const UserServices = {
  async find(query: FilterQuery<UserDocument>) {
    const docs = await UserModal.find(query);
    return docs;
  },
  async findById(id: UserDocument["_id"]) {
    const doc = await UserModal.findById(id);
    return doc;
  },
  async findByIdOrFail(id: UserDocument["_id"]) {
    const doc = await UserModal.findById(id);
    if (!doc) throw new Error("404:-User not found");
    return doc;
  },
  async findByWhereOrFail(where: FilterQuery<UserDocument>) {
    const doc = await UserModal.findOne(where);
    if (!doc) throw new Error("404:-User not found");
    return doc;
  },
  async updateDocument(id: UserDocument["_id"], body: Partial<UserDocument>) {
    const doc = await UserServices.findByIdOrFail(id);
    doc.set(body);
    return await doc.save();
  },
  async createUser({ email, password, ...body }: CreateUserFormValues) {
    const doc = await UserModal.findOne({ email });
    if (doc) throw new Error("400:-User taken!");
    const hashedPwd = await hashPassword(password);
    const newUser = await UserModal.create({
      ...body,
      email,
      avatar: "https://picsum.photos/50",
    })
    const newAuth = await AuthServices.createDocument({
      logged_in_through: body.type,
      user: newUser.id,
      password: hashedPwd
    });
    newUser.auth = newAuth.id;
    try {
      await UserServices.sendAccountActivationCode(newUser);
      Logger.info(`[SYSTEM] --> Account activation instruction sent for ${newUser.email}.`);
    } catch (err) {
      Logger.error(err, "Failed to send user account activation email!");
    }
    return await newUser.save();
  },
  async sendAccountActivationCode(user: UserDocument) {
    // Will expire in 5 min...
    const activationCodeTtl = Date.now() + +ACCOUNT_ACTIVATION_TTL;
    const activationCode = Math.floor(100000 + Math.random() * 900000);
    const doc = await AuthServices.updateDocument(user.auth, {
      activation_code: activationCode + "",
      activation_code_ttl: activationCodeTtl
    })
    return await sendMailThroughNodemailer({
      to: user.email,
      subject: "ChatApp Account Activation Instruction",
      template: accountActivationEmailTemplate({
        name: `${user.firstName} ${user.lastName}`.toLowerCase(),
        activationCode: doc.activation_code!,
      }),
    });
  },
}