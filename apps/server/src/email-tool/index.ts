import { WelcomeEmail, ResetPasswordEmail, ExistingUserEmployeeEmail, CreateEmployeeEmail } from "emails";
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

type TemplateArguments = {
  email: string;
  token: string,
  name: string;
  businessName: string;
}

type RequestAccount = Pick<TemplateArguments, 'email' | 'token'>
type ResetPassword = Pick<TemplateArguments, 'email' | 'token' | 'name'>
type RequestEmployeeAccount = Omit<TemplateArguments, 'name'>
type ExistingUserEmployee = Omit<TemplateArguments, 'token'>

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  }
});

const passwordReset = ({ token, email }: ResetPassword) => `${process.env.FRONTEND_URL}/business/reset-password?token=${token}&email=${email}`

const requestAccountCreation = ({ token, email }: RequestAccount) => `${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}`

const requestEmployeeAccountCreation = ({ token, email, businessName }: RequestEmployeeAccount) => `${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}&business=${businessName}`

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
}: ResetPassword) {
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

export async function sendEployeeAccountCreation({ token, email, businessName, name }: TemplateArguments) {
  const url = requestEmployeeAccountCreation({ token, email, businessName })

  // TODO: import the right component and change the subject
  const emailHtml = render(CreateEmployeeEmail({ url, businessName, name }))
  const options = {
    from: '',
    to: email,
    subject: 'Managing Multiple Businesses with Fasto',
    html: emailHtml,
  };

  const response = await transporter.sendMail(options);
  return { ok: !!response, url }
};

export async function sendExistingUserEployeeEmail({ email, businessName, name }: ExistingUserEmployee) {
  const url = `${process.env.FRONTEND_URL}`

  // TODO: import the right component and change the subject
  const emailHtml = render(ExistingUserEmployeeEmail({ url, businessName, name }))
  const options = {
    from: '',
    to: email,
    subject: 'Managing Multiple Businesses with Fasto',
    html: emailHtml,
  };

  const response = await transporter.sendMail(options);
  return { ok: !!response, url }
};