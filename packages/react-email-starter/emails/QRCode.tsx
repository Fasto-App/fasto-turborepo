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
    preview: "Get a sneak peek of your Fasto Business QR Code",
    h1: "Your Fasto Business QR Code",
    p1: "We're thrilled to provide you with your unique Fasto Business QR Code! This QR Code will serve as a direct link to your business's homepage, making it easier for your customers to explore your offerings.",
    p2: "You can use this QR Code for various purposes, such as getting it printed on promotional materials, adding it to your website, or sharing it with your customers through digital channels.",
    p3: "Please find the attached QR Code image file. Feel free to save it, print it, or incorporate it into your marketing strategies to enhance your customer's experience.",
    p4: "If you have any questions or need further assistance, don't hesitate to reach out to our support team."
  },
  pt: {
    "preview": "Veja uma prévia do seu Código QR de Negócios Fasto!",
    h1: "O seu Fasto Business QR Code",
    p1: "Estamos entusiasmados em fornecer o seu exclusivo Código QR Fasto Business! Este Código QR servirá como um link direto para a página inicial da sua empresa, facilitando para os seus clientes explorarem as suas ofertas.",
    p2: "Você pode usar este Código QR para várias finalidades, como imprimi-lo em materiais promocionais, adicioná-lo ao seu site ou compartilhá-lo com os seus clientes através de canais digitais.",
    p3: "Por favor, encontre o arquivo de imagem do Código QR anexado. Sinta-se à vontade para salvá-lo, imprimi-lo ou incorporá-lo nas suas estratégias de marketing para aprimorar a experiência dos seus clientes.",
    p4: "Se tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato com a nossa equipe de suporte."
  },
  es: {
    preview: "Obtén un vistazo de tu Código QR de Negocio Fasto",
    h1: "",
    p1: "¡Estamos emocionados de proporcionarte tu exclusivo Código QR de Negocio Fasto! Este Código QR servirá como un enlace directo a la página de inicio de tu negocio, facilitando que tus clientes exploren tus ofertas.",
    p2: "Puedes utilizar este Código QR para diversos fines, como imprimirlo en materiales promocionales, agregarlo a tu sitio web o compartirlo con tus clientes a través de canales digitales.",
    p3: "Por favor, encuentra el archivo de imagen del Código QR adjunto. Siéntete libre de guardarlo, imprimirlo o incorporarlo a tus estrategias de marketing para mejorar la experiencia de tus clientes.",
    p4: "Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de soporte."
  }
}




export function QRCode({ locale = "en" }: { locale: Locale }) {
  return (
    <Html>
      <Head />
      <Preview>{texts[locale].preview}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src="https://fastoapp.com/images/fasto-logo.svg"
              width="100"
              height="21"
              alt="Fasto"
            />
            <Hr style={hr} />
            <Text style={h1}>{texts[locale].h1}</Text>
            <Text style={paragraph}>{texts[locale].p1}</Text>
            <Text style={paragraph}>{texts[locale].p2}</Text>
            <Text style={paragraph}>{texts[locale].p3}</Text>
            <Text style={paragraph}>{texts[locale].p4}</Text>

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

export default QRCode;

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

const footer = {
  color: '#8898aa',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
};
