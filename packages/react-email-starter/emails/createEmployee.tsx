import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import * as React from "react";
import { Locale } from "app-helpers";

export const texts = {
	en: {
		preview: "Welcome to Fasto! We are delighted to have you onboard.",
		dearEmployee: (name: string) => `Dear ${name},`,
		welcome: (businessName: string) =>
			`Welcome to the team at ${businessName}! We are delighted to have you onboard.`,
		toGetStarted:
			"To get started, we would like you to create an employee account on our restaurant platform, where you can access important information such as menus, tabs, and other relevant details.",
		toCreateYourAccount:
			"To create your account, please click on the button below, enter your personal information and create a secure password.",
		cta: "Setup Account",
		onceYourAccount:
			"Once your account has been created, you can access the platform using your email address and password. You will be able to view customers, and communicate with your colleagues.",
		ifYouHaveQuestions:
			"If you have any questions or need help with the platform, please do not hesitate to reach out to our management team at [Management Email Address] or speak to a member of our staff.",
		thankYou:
			"Thank you for joining us at Fasto. We look forward to working with you.",
	},
	es: {
		preview:
			"¡Bienvenido/a a Fasto! Estamos encantados de que te unas a nosotros.",
		dearEmployee: (name: string) => `Estimado/a ${name},`,
		welcome: (businessName: string) =>
			`¡Bienvenido/a al equipo de ${businessName}! Estamos encantados de que te unas a nosotros.`,
		toGetStarted:
			"Para comenzar, nos gustaría que crees una cuenta de empleado en nuestra plataforma de restaurantes, donde podrás acceder a información importante como menús, cuentas y otros detalles relevantes.",
		toCreateYourAccount:
			"Para crear tu cuenta, haz clic en el botón a continuación, ingresa tu información personal y crea una contraseña segura.",
		cta: "Configurar Cuenta",
		onceYourAccount:
			"Una vez creada tu cuenta, podrás acceder a la plataforma utilizando tu dirección de correo electrónico y contraseña. Podrás ver a los clientes y comunicarte con tus compañeros de trabajo.",
		ifYouHaveQuestions:
			"Si tienes alguna pregunta o necesitas ayuda con la plataforma, no dudes en comunicarte con nuestro equipo de administración a través de [Dirección de correo electrónico de administración] o hablar con un miembro de nuestro personal.",
		thankYou:
			"Gracias por unirte a nosotros en Fasto. Esperamos trabajar contigo.",
	},
	pt: {
		preview: "Bem-vindo ao Fasto! Estamos encantados por tê-lo a bordo.",
		dearEmployee: (name: string) => `Caro/a ${name},`,
		welcome: (businessName: string) =>
			`Bem-vindo/a à equipe do ${businessName}! Estamos encantados por tê-lo a bordo.`,
		toGetStarted:
			"Para começar, gostaríamos que você criasse uma conta de funcionário em nossa plataforma de restaurante, onde poderá acessar informações importantes, como menus, contas e outros detalhes relevantes.",
		toCreateYourAccount:
			"Para criar sua conta, clique no botão abaixo, insira suas informações pessoais e crie uma senha segura.",
		cta: "Configurar Conta",
		onceYourAccount:
			"Após a criação de sua conta, você poderá acessar a plataforma usando seu endereço de e-mail e senha. Você poderá visualizar os clientes e se comunicar com seus colegas de trabalho.",
		ifYouHaveQuestions:
			"Se tiver alguma dúvida ou precisar de ajuda com a plataforma, não hesite em entrar em contato com nossa equipe de gerenciamento em [Endereço de e-mail de gerenciamento] ou falar com um membro de nossa equipe.",
		thankYou:
			"Obrigado por se juntar a nós no Fasto. Estamos ansiosos para trabalhar com você.",
	},
};

export function CreateEmployeeEmail({
	url = "https://fastoapp.com",
	name = "John Doe",
	businessName = "Fasto",
	locale = "en",
}: {
	url: string;
	name: string;
	businessName: string;
	locale: Locale;
}) {
	return (
		<Html>
			<Head />
			<Preview>{texts[locale].preview}</Preview>
			<Section style={main}>
				<Container style={container}>
					<Section style={box}>
						<Img
							src={"/static/fasto-logo.png"}
							alt="Fasto Logo"
							width={112}
							height={25}
							style={{ margin: 0 }}
						/>
						<Hr style={hr} />
						<Text style={h1}>{texts[locale].dearEmployee(name)}</Text>
						<Text style={paragraph}>{texts[locale].welcome(businessName)}</Text>
						<Text style={paragraph}>{texts[locale].toGetStarted}</Text>
						<Text style={paragraph}>{texts[locale].toCreateYourAccount}</Text>
						<Button pX={10} pY={10} style={button} href={url}>
							{texts[locale].cta}
						</Button>
						<Hr style={hr} />
						<Text style={paragraph}>{texts[locale].onceYourAccount}</Text>
						<Text style={paragraph}>{texts[locale].thankYou}</Text>
						<Text style={paragraph}>Cheers</Text>
						<Text style={paragraph}>— The Fasto team</Text>
						<Hr style={hr} />
						<Text style={footer}>Fasto, 511 E 75th St, New York, NY 10021</Text>
					</Section>
				</Container>
			</Section>
		</Html>
	);
}

export default CreateEmployeeEmail;

const main = {
	backgroundColor: "#f6f9fc",
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
};

const box = {
	padding: "0 48px",
};

const hr = {
	borderColor: "#e6ebf1",
	margin: "20px 0",
};

const h1 = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "24px",
	fontWeight: "bold",
	margin: "20px 0",
	padding: "0",
};

const paragraph = {
	color: "#525f7f",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "justify" as const,
};

const anchor = {
	color: "#556cd6",
};

const button = {
	backgroundColor: "#f65135",
	borderRadius: "5px",
	color: "#fff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "100%",
};

const footer = {
	color: "#8898aa",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: "12px",
	lineHeight: "16px",
};
