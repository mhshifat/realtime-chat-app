export const accountActivationEmailTemplate = ({ name, activationCode }: { name: string, activationCode: string }) => `
  <div>
    <h2>Hello ${name}, please activate your account by pasting the below code...</h2>
    <br />
    <h1>${activationCode}</h1>
  </div>
`;
export const forgotPasswordEmailTemplate = ({ name, newPass }: { name: string, newPass: string }) => `
  <div>
    <h2>Hello ${name}, please activate your account by pasting the below code...</h2>
    <br />
    <h1>${newPass}</h1>
  </div>
`;