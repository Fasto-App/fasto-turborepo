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
import { texts } from './welcomeText';
import { Locale } from 'app-helpers';

export function WelcomeEmail({ url, locale }: { url: string, locale: Locale }) {
  return (
    <Html>
      <Head />
      <Preview>{texts[locale].preview}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHLwTzHGQL-xP0zsBPekihSODufm8LrdrkOLh3N9i0SNKZNU7Q9dRvvFbuTu0Y75lt_w&usqp=CAU"
              width="100"
              height="21"
              alt="Fasto"
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
