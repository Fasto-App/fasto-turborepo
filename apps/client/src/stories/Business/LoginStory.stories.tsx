//@ts-nocheck
import React from "react";
import { LoginForm } from "../../business-templates/Login";
import { StoryProvider } from "../StoryProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Business/Login",
	component: LoginForm,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: "color" },
	},
};

const Template = (args) => <LoginForm {...args} />;

// our current primary color is #00bcd4
export const InitialState = Template.bind({});
InitialState.args = {
	// primary: "red",
};
