import { WelcomeEmail } from "emails";
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

type TemplateArguments = {
  email: string;
  token: string,
  _id: string;
  name: string;
}

type AccountCreation = Pick<TemplateArguments, 'email' | 'token'>
type ResetPassword = Pick<TemplateArguments, 'email' | 'token' | '_id'>
type AddEmployee = Pick<TemplateArguments, 'email' | 'token' | 'name'>

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "fasto.contact@gmail.com",
    pass: "ybgtxckrrcybtuok"
  }
});

const resetPassword = ({ token, email, _id }: ResetPassword) => `${process.env.FRONTEND_URL}/business/reset-password?token=${token}&email=${email}&_id=${_id}`

const requestAccountCreation = ({ token, email }: AccountCreation) => `${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}`

export async function sendWelcomeEmail({
  email,
  token,
}: AccountCreation) {
  const url = requestAccountCreation({ token, email })

  try {
    const emailHtml = render(WelcomeEmail({ url }))

    const options = {
      from: 'fasto.contact@gmail.com',
      subject: 'Welcome to Fasto',
      to: email,
      html: emailHtml,
    };

    const response = await transporter.sendMail(options);
    return { ok: !!response, url }
  } catch (error) {

    console.log(error)
    return { ok: false, url }
  }
}

export async function sendResetPasswordEmail({
  email,
  token,
  _id
}: TemplateArguments) {
  const url = resetPassword({ token, email, _id })

  try {
    // create component with the url and name
    const emailHtml = render(WelcomeEmail({ url }))
    const options = {
      from: '',
      to: email,
      subject: "Don't worry, we will be reseting your password soon!",
      html: emailHtml,
    };

    const response = await transporter.sendMail(options);
    return { ok: !!response, url }
  } catch (error) {
    console.log(error)
    return { ok: false, url }
  }
}

// TODO:
export async function sendEployeeEmail({ token, email, name }: AddEmployee) {

  // if it's a new user, create a new account

  // otherwise, send an email to the user with the link to the business

  const url = requestAccountCreation({ token, email })
  // create component with the url and name
  const emailHtml = render(WelcomeEmail({ url }))
  const options = {
    from: '',
    to: email,
    subject: 'Assunto da mensagem',
    html: emailHtml,
  };

  const response = await transporter.sendMail(options);
  return { ok: !!response, url }
};