import nodemailer from "nodemailer";
import path from "path";
import { MailOptions } from "../utils";

const { MAIL_EMAIL, MAIL_PASS } = process.env;
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASS,
  },
});
export const sendMailThroughNodemailer = ({ to, subject, template }: MailOptions) => {
  let mailOptions = {
    from: `Chat App <${MAIL_EMAIL}>`,
    to,
    subject,
    html: template,
  };
  
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info.accepted);
      }
    })
  });
}