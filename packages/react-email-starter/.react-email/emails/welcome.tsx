import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import { Locale } from 'app-helpers';

export const texts = {
  en: {
    preview: "You're one step away from helping innovate the food business industry!",
    welcome: "Welcome to Fasto!",
    weAreThrilled: "We are thrilled to welcome you to our company! We are looking forward to the valuable contribution you will bring to our team.",
    getStarted: "To get started, we need you to set up your new account by clicking on the button below.",
    onceYouHave: "Once you have successfully set up your account, you will be able to access all the resources and tools you need to start working with us.",
    thankYou: "Thank you again for joining our team and we are looking forward to a productive and successful collaboration!",
    cta: "Setup Account Password",
  },
  pt: {
    "preview": "Você está a um passo de ajudar a inovar na indústria de negócios de alimentos!",
    "welcome": "Bem-vindo/a ao Fasto!",
    "weAreThrilled": "Estamos empolgados em recebê-lo/a em nossa empresa! Estamos ansiosos pela valiosa contribuição que você trará para nossa equipe.",
    "getStarted": "Para começar, precisamos que você configure sua nova conta clicando no botão abaixo.",
    "onceYouHave": "Após configurar sua conta com sucesso, você poderá acessar todos os recursos e ferramentas necessários para começar a trabalhar conosco.",
    "thankYou": "Obrigado/a novamente por se juntar à nossa equipe e estamos ansiosos por uma colaboração produtiva e bem-sucedida!",
    "cta": "Configurar Senha da Conta",
  },
  es: {
    "preview": "¡Estás a un paso de ayudar a innovar en la industria de negocios de alimentos!",
    "welcome": "¡Bienvenido/a a Fasto!",
    "weAreThrilled": "¡Estamos emocionados de darte la bienvenida a nuestra empresa! Esperamos con ansias la valiosa contribución que aportarás a nuestro equipo.",
    "getStarted": "Para comenzar, necesitamos que configures tu nueva cuenta haciendo clic en el botón a continuación.",
    "onceYouHave": "Una vez que hayas configurado tu cuenta correctamente, podrás acceder a todos los recursos y herramientas que necesitas para comenzar a trabajar con nosotros.",
    "thankYou": "¡Gracias nuevamente por unirte a nuestro equipo y esperamos tener una colaboración productiva y exitosa!",
    "cta": "Configurar Contraseña de la Cuenta",
  }
}




export function WelcomeEmail({ url = "https://fastoapp.com", locale = "en" }: { url: string, locale: Locale }) {
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
            <Text style={h1}>{texts[locale].welcome}</Text>
            <Text style={paragraph}>
              {texts[locale].weAreThrilled}
            </Text>
            <Text style={paragraph}>
              {texts[locale].getStarted}
            </Text>
            <Button
              pX={10}
              pY={10}
              style={button}
              href={url}
            >
              {texts[locale].cta}
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              {texts[locale].onceYouHave}
            </Text>
            <Text style={paragraph}>
              {texts[locale].thankYou}
            </Text>
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

export default WelcomeEmail;

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
