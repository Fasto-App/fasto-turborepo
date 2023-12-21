import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Locale } from 'app-helpers';
import * as React from 'react';

export const texts = {
  en: {
    preview: "Don't worry, we will be reseting your password soon",
    weHaveReceived: "We have received a request to reset the password for your account. If you did not request a password reset, please contact us immediately.",
    toReset: "To reset your password, please click on the following link:",
    thisLnk: "This link is valid for 24 hours. After that, you will need to request another password reset.",
    cta: "Reset Password Now",
  },
  es: {
    "preview": "No te preocupes, pronto restableceremos tu contraseña",
    "weHaveReceived": "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no solicitaste un restablecimiento de contraseña, por favor contáctanos de inmediato.",
    "toReset": "Para restablecer tu contraseña, haz clic en el siguiente enlace:",
    "thisLnk": "Este enlace es válido por 24 horas. Después de ese tiempo, deberás solicitar otro restablecimiento de contraseña.",
    "cta": "Restablecer Contraseña Ahora",
  },
  pt: {
    "preview": "Não se preocupe, em breve iremos redefinir sua senha",
    "weHaveReceived": "Recebemos uma solicitação para redefinir a senha da sua conta. Se você não solicitou uma redefinição de senha, entre em contato conosco imediatamente.",
    "toReset": "Para redefinir sua senha, clique no seguinte link:",
    "thisLnk": "Este link é válido por 24 horas. Após esse período, você precisará solicitar outra redefinição de senha.",
    "cta": "Redefinir Senha Agora",
  }
}



export function ResetPasswordEmail({ url = "https://fastoapp.com", name = "Alex", locale = "pt" }:
  { url: string, name: string, locale: Locale }) {
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
            <Text style={paragraph}>
              {texts[locale].weHaveReceived}
            </Text>
            <Text style={paragraph}>
              {texts[locale].toReset}
            </Text>
            <Button
              pX={10}
              pY={10}
              style={button}
              href={url}
            >
              {texts[locale].cta}
            </Button>
            <Text style={paragraph}>
              {texts[locale].thisLnk}
            </Text>
            <Hr style={hr} />
            <Text style={paragraph}>Cheers</Text>
            <Text style={paragraph}>— The Fasto team</Text>
            <Hr style={hr} />
            <Text style={footer}>
              Fasto, 511 E 75th St, New York, NY 10021
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0',
};

const paragraph = {
  color: '#525f7f',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'justify' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#f65135',
  borderRadius: '5px',
  color: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const footer = {
  color: '#8898aa',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
};
