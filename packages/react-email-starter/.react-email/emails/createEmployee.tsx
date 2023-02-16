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
  welcome: (businessName: string) => `Welcome to the team at ${businessName}! We are delighted to have you onboard.`,
  toGetStarted: "To get started, we would like you to create an employee account on our restaurant platform, where you can access important information such as menus, tabs, and other relevant details.",
  toCreateYourAccount: "To create your account, please click on the button below, enter your personal information and create a secure password.",
  cta: "Setup Account",
  onceYourAccount: "Once your account has been created, you can access the platform using your email address and password. You will be able to view customers, and communicate with your colleagues.",
  ifYouHaveQuestions: "If you have any questions or need help with the platform, please do not hesitate to reach out to our management team at [Management Email Address] or speak to a member of our staff.",
  thankYou: "Thank you for joining us at Fasto. We look forward to working with you.",
}

export function CreateEmployeeEmail({
  url = "https://fasto.app",
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
            <Text style={paragraph}>{texts.welcome(businessName)}</Text>
            <Text style={paragraph}>
              {texts.toGetStarted}
            </Text>
            <Text style={paragraph}>
              {texts.toCreateYourAccount}
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
            <Text style={paragraph}>
              {texts.onceYourAccount}
            </Text>
            <Text style={paragraph}>
              {texts.thankYou}
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

export default CreateEmployeeEmail;

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
