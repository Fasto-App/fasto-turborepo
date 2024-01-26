import {
	WelcomeEmail,
	ResetPasswordEmail,
	ExistingUserEmployeeEmail,
	CreateEmployeeEmail,
	QRCode,
} from "emails";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { Locale } from "app-helpers";

type TemplateArguments = {
	email: string;
	token: string;
	name: string;
	businessName: string;
	locale: Locale;
};

const texts = {
	en: {
		welcome: "Welcome to Fasto",
		passwordRequest: "Password Reset Request",
		manageBusiness: "Managing Multiple Businesses with Fasto",
	},
	pt: {
		welcome: "Bem-vindo ao Fasto",
		passwordRequest: "Solicitação de Redefinição de Senha",
		manageBusiness: "Gerenciando Múltiplos Negócios com o Fasto",
	},
	es: {
		welcome: "Bienvenido/a a Fasto",
		passwordRequest: "Solicitud de Restablecimiento de Contraseña",
		manageBusiness: "Gestión de Múltiples Negocios con Fasto",
	},
};

type RequestAccount = Pick<TemplateArguments, "email" | "token" | "locale">;
type ResetPassword = Pick<
	TemplateArguments,
	"email" | "token" | "name" | "locale"
>;
type RequestEmployeeAccount = Omit<TemplateArguments, "name">;
type ExistingUserEmployee = Omit<TemplateArguments, "token">;

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.EMAIL_ACCOUNT,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const passwordReset = ({ token, email }: ResetPassword) =>
	`${process.env.FRONTEND_URL}/business/reset-password?token=${token}&email=${email}`;

const requestAccountCreation = ({ token, email }: RequestAccount) =>
	`${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}`;

const requestEmployeeAccountCreation = ({
	token,
	email,
	businessName,
}: RequestEmployeeAccount) =>
	`${process.env.FRONTEND_URL}/business/create-account?token=${token}&email=${email}&business=${businessName}`;

export async function sendWelcomeEmail({
	email,
	token,
	locale,
}: RequestAccount) {
	const url = requestAccountCreation({ token, email, locale });

	try {
		const emailHtml = render(WelcomeEmail({ url, locale }));

		const options = {
			from: process.env.EMAIL_ACCOUNT,
			subject: texts[locale].welcome,
			to: email,
			html: emailHtml,
		};

		const response = await transporter.sendMail(options);
		return { ok: !!response, url };
	} catch (error) {
		console.log(error);
		return { ok: false, url };
	}
}

export async function sendResetPasswordEmail({
	email,
	token,
	name,
	locale,
}: ResetPassword) {
	const url = passwordReset({ token, email, name, locale });

	try {
		// create component with the url and name
		const emailHtml = render(ResetPasswordEmail({ url, name, locale }));
		const options = {
			from: process.env.EMAIL_ACCOUNT,
			to: email,
			subject: texts[locale].passwordRequest,
			html: emailHtml,
		};

		const response = await transporter.sendMail(options);
		return { ok: !!response, url };
	} catch (error) {
		console.log(error);
		return { ok: false, url };
	}
}

export async function sendEployeeAccountCreation({
	token,
	email,
	businessName,
	name,
	locale,
}: TemplateArguments) {
	const url = requestEmployeeAccountCreation({
		token,
		email,
		businessName,
		locale,
	});

	// TODO: import the right component and change the subject
	//
	const emailHtml = render(
		CreateEmployeeEmail({ url, businessName, name, locale }),
	);
	const options = {
		from: process.env.EMAIL_ACCOUNT,
		to: email,
		subject: texts[locale].manageBusiness,
		html: emailHtml,
	};

	const response = await transporter.sendMail(options);
	return { ok: !!response, url };
}

export async function sendExistingUserEployeeEmail({
	email,
	businessName,
	name,
	locale,
}: ExistingUserEmployee) {
	const url = `${process.env.FRONTEND_URL}`;

	// TODO: import the right component and change the subject
	const emailHtml = render(
		ExistingUserEmployeeEmail({ url, businessName, name, locale }),
	);
	const options = {
		from: process.env.EMAIL_ACCOUNT,
		to: email,
		subject: texts[locale].manageBusiness,
		html: emailHtml,
	};

	const response = await transporter.sendMail(options);
	return { ok: !!response, url };
}

type QRCodeParams = {
	emailTo: string;
	locale: Locale;
	buffer: Buffer;
};

export const sendQRCodeAttachment = async ({
	locale,
	emailTo,
	buffer,
}: QRCodeParams) => {
	const emailHtml = render(QRCode({ locale }));

	const options = {
		from: process.env.EMAIL_ACCOUNT,
		to: emailTo,
		subject: texts[locale].manageBusiness,
		html: emailHtml,
		attachments: [
			{
				content: buffer,
				filename: "qr-code.jpeg",
				contentType: "image/jpeg",
			},
		],
	};

	const response = await transporter.sendMail(options);

	return { ok: !!response };
};
