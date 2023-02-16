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

const texts = {
  preview: "Welcome to Fasto! We are delighted to have you onboard.",
  dearEmployee: (name: string) => `Dear ${name},`,
  weAreExcited: `We are excited to inform you that one of our partner companies is interested in inviting you to manage one of their businesses within our platform.`,
  companyName: (companyName: string) => `${companyName} is a growing company within our platform and they believe that your experience and skills make you an excellent candidate to manage one of their businesses. This is a great opportunity for you to expand your skill set and contribute to the success of a growing business within our platform.`,
  toSwitch: 'To switch between businesses, simply log in to your Fasto account and navigate to the "Businesses" section. From there, you can view all the businesses that you manage, and switch between them with just a few clicks.',
  thankYou: "Thank you for your continued support of Fasto. We look forward to seeing your continued success within our platform.",
  cta: "Navigate to Fasto",
}

export function ExistingUserEmployeeEmail({
  url = "https://fastoapp.com",
  name = "John Doe",
  businessName = "Fasto",
}: { url: string, name: string, businessName: string }) {
  return (
    <Html>
      <Head />
      <Preview>{texts.preview}</Preview>
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
            <Text style={h1}>{texts.dearEmployee(name)}</Text>
            <Text style={paragraph}>{texts.weAreExcited}</Text>
            <Text style={paragraph}>
              {texts.companyName(businessName)}
            </Text>
            <Text style={paragraph}>
              {texts.toSwitch}
            </Text>
            <Text style={paragraph}>
              {texts.thankYou}
            </Text>
            <Button
              pX={10}
              pY={10}
              style={button}
              href={url}
            >
              {texts.cta}
            </Button>
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

export default ExistingUserEmployeeEmail;

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
