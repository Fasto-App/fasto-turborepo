//@ts-nocheck
import React from "react"
import { ForgotPasswordForm } from "../../business-templates/ForgotPassword";
// import { ForgotPasswordForm } from "../../business-templates/ResetPasswordScreen";
import { StoryProvider } from "../StoryProvider"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Business/ForgotPassword",
  component: ForgotPasswordForm,
  decorators: [StoryProvider],
  argTypes: {
    primary: { control: "color" },
  }
}

const Template = (args) => <ForgotPasswordForm {...args} />

// our current primary color is #00bcd4
export const InitialState = Template.bind({});
InitialState.args = {
  // primary: "red",
}