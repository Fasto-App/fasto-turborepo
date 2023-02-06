import { VercelEmail } from "emails";
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8f71780f9bc54e",
    pass: "622dbb18edba43"
  }
});

const resetPassword = ({ token, email, _id }: TemplateArguments) => `${process.env.FRONTEND_URL}/business/reset-password?token=${token}&email=${email}&_id=${_id}`

const requestAccountCreation = ({ token, email }: TemplateArguments) => `${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}`

const templates = {
  "add-new-emlployee": {
    getUrl: resetPassword,
  },
  "reset-password": {
    getUrl: resetPassword,
  },
  "request-account-creation": {
    getUrl: requestAccountCreation
  },
  "add-new-business": {
    getUrl: () => ''
  },
} as const


type CourierTemplate = keyof typeof templates

type TemplateArguments = {
  template: CourierTemplate;
  email: string;
  token: string,
  _id: string;
  name: string;
}

export async function sendEmail({
  template,
  email,
  _id,
  token,
  name
}: TemplateArguments) {

  const url = templates[template].getUrl({
    _id,
    email,
    token,
    template,
    name
  })


  try {
    console.log('emailHtml')
    const emailHtml = render(VercelEmail({ url }))
    console.log(emailHtml)


    const options = {
      from: 'fasto.contact@gmail.com',
      to: email,
      subject: 'Assunto da mensagem',
      html: emailHtml,
    };

    const response = await transporter.sendMail(options);
    return { ok: !!response, url }
  } catch (error) {

    console.log(error)
    return { ok: false, url }
  }
}