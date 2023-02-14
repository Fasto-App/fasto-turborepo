import { WelcomeEmail, ResetPasswordEmail } from "emails";
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

type TemplateArguments = {
  email: string;
  token: string,
  name: string;
}

type RequestAccount = Pick<TemplateArguments, 'email' | 'token'>

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "fasto.contact@gmail.com",
    pass: "ybgtxckrrcybtuok"
  }
});

const passwordReset = ({ token, email }: TemplateArguments) => `${process.env.FRONTEND_URL}/business/reset-password?token=${token}&email=${email}`

const requestAccountCreation = ({ token, email }: RequestAccount) => `${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}`

export async function sendWelcomeEmail({
  email,
  token,
}: RequestAccount) {
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
  name,
}: TemplateArguments) {
  const url = passwordReset({ token, email, name })

  try {
    // create component with the url and name
    const emailHtml = render(ResetPasswordEmail({ url, name }))
    const options = {
      from: '',
      to: email,
      subject: "Password Reset Request",
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
export async function sendEployeeEmail({ token, email }: TemplateArguments) {

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