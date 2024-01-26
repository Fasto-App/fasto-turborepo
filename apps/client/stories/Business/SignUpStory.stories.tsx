//@ts-nocheck
import React from "react";
import { SignUpFormScreen } from "../../business-templates/SignUp";

import { StoryProvider } from "../StoryProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Business/Signup",
	component: SignUpFormScreen,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: "color" },
	},
};

const Template = (args) => <SignUpFormScreen {...args} />;

// our current primary color is #00bcd4
export const InitialState = Template.bind({});
InitialState.args = {
	// primary: "red",
};
