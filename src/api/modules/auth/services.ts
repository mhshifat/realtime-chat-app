import { FilterQuery } from "mongoose";
import { comparePassword, hashPassword, hashPayloadForUserAuthentication, Logger, parseAccountActivationHash, sendMailThroughNodemailer } from "../../../libs";
import { AccountActivationJwtPayload, ActivateAccountFormValues, AuthDocument, forgotPasswordEmailTemplate, LoginFormValues, randomStringMake, ResendAccountActivationFormValues, UserDocument } from "../../../utils";
import { UserServices } from "../user/services";
import { AuthModal } from './model';

const { ACCOUNT_ACTIVATION_TTL = 30000 } = process.env;
export const AuthServices = {
  async findById(id: AuthDocument["_id"]) {
    const doc = await AuthModal.findById(id);
    return doc;
  },
  async findByIdOrFail(id: AuthDocument["_id"]) {
    const doc = await AuthModal.findById(id);
    if (!doc) throw new Error("404:-User not found");
    return doc;
  },
  async findByWhereOrFail(where: FilterQuery<AuthDocument>) {
    const doc = await AuthModal.findOne(where);
    if (!doc) throw new Error("404:-User not found");
    return doc;
  },
  async updateDocument(id: AuthDocument["_id"], body: Partial<AuthDocument>) {
    const doc = await AuthServices.findByIdOrFail(id);
    doc.set(body);
    return await doc.save();
  },
  async createDocument(body: Partial<Omit<AuthDocument, "_id">>) {
    return await AuthModal.create(body);
  },
  async resendAccountActivationCode(body: ResendAccountActivationFormValues) {
    const { email } = await parseAccountActivationHash<AccountActivationJwtPayload>(body.hash)
    const doc = await UserServices.findByWhereOrFail({ email });
    const auth = await AuthServices.findByWhereOrFail({ _id: doc.auth });
    if (auth.isActivated) throw new Error("400:-Account already activated");
    try {
      await UserServices.sendAccountActivationCode(doc);
    } catch (err) {
      Logger.error(err, "Failed to send user account activation email!");
    }
    return doc;
  },
  async activateAccount(body: ActivateAccountFormValues) {
    const { email } = await parseAccountActivationHash<AccountActivationJwtPayload>(body.hash)
    const doc = await UserServices.findByWhereOrFail({ email });
    const auth = await AuthServices.findByWhereOrFail({ user: doc.id });
    if (auth.isActivated) throw new Error("400:-Account already activated");
    if (!auth?.activation_code || !auth?.activation_code_ttl) throw new Error("400:-Please resend account activation code");
    if (Date.now() > auth?.activation_code_ttl) throw new Error("403:-Token expired");
    if (auth?.activation_code !== body.code) throw new Error("400:-Activation code doesn't match");
    auth.activation_code = "";
    auth.activation_code_ttl = undefined;
    auth.isActivated = true;
    await auth.save();
    const token = hashPayloadForUserAuthentication({ uid: doc.id }, auth.password);
    return { user: doc, token };
  },
  async forgotPassword(email: UserDocument["email"]) {
    const doc = await UserServices.findByWhereOrFail({ email });
    const auth = await AuthServices.findByWhereOrFail({ user: doc.id });
    const newPass = randomStringMake(6);
    const hashedPwd = await hashPassword(newPass);
    auth.password = hashedPwd;
    await auth.save();
    await sendMailThroughNodemailer({
      to: email,
      subject: "New password for WeChat Account",
      template: forgotPasswordEmailTemplate({
        name: `${doc.firstName} ${doc.lastName}`, newPass
      }),
    })
  },
  async login(body: LoginFormValues) {
    const doc = await UserServices.findByWhereOrFail({ email: body.email });
    const auth = await AuthServices.findByWhereOrFail({ user: doc.id });
    if (!auth.isActivated) throw new Error("403:-Please activate your account to log in.");
    const isPwdMatched = await comparePassword(auth.password, body.password);
    if (!isPwdMatched) throw new Error("400:-Wrong credentials.");
    const token = hashPayloadForUserAuthentication({ uid: doc.id }, auth.password);
    return { user: doc, token };
  },
  async generateToken(user: UserDocument) {
    const auth = await AuthServices.findByWhereOrFail({ user: user._id });
    const token = hashPayloadForUserAuthentication({ uid: user._id }, auth.password);
    return token;
  },
}