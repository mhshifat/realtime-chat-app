export interface LoadersConfig {
  port: string | number;
  mongo_string: string;
}
export interface ResponsesOptions {
  statusCode?: number;
  errors?: { path: string, message: string }[]
  log?: string
}
export interface LoginFormValues {
  email: string;
  password: string;
}
export interface ResendAccountActivationFormValues {
  hash: string;
}
export interface ForgotPasswordFormValues {
  email: string;
}
export interface ActivateAccountFormValues {
  code: string;
  hash: string;
}
export interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type?: AuthDocumentLoggedInThrough;
}
export interface CreateMessageFormValues {
  receiver: string;
  body: string;
}
export interface MailOptions {
  to: string;
  subject: string;
  template: string;
}
export enum AuthDocumentLoggedInThrough {
  Email="EMAIL",
  Google="GOOGLE",
  Facebook="FACEBOOK",
}
export interface AuthDocument {
  _id?: string;
  password: string;
  user: UserDocument["_id"];
  logged_in_through: AuthDocumentLoggedInThrough;
  activation_code?: string;
  isActivated?: boolean;
  activation_code_ttl?: number;
}
export interface UserDocument {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  auth: AuthDocument["_id"];
}
export interface MessageDocument {
  _id?: string;
  sender: UserDocument["_id"];
  receiver: UserDocument["_id"];
  body: string;
}
export enum LogFormatterType {
  System="SYSTEM",
  USER_Actions="USER_ACTIONS",
}
export interface AccountActivationJwtPayload {
  email: string;
}
export interface UserAuthJwtPayload {
  uid: UserDocument["_id"];
}
export interface DataFormatterItems<TData> {
  formatType: DataFormatterTypes;
  data: TData
}
export enum DataFormatterTypes {
  User="USER"
}