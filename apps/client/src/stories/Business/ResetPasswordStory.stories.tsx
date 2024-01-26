//@ts-nocheck
import React from "react";
import { BusinessResetPassword } from "../../business-templates/ResetPassword";
import { StoryProvider } from "../StoryProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Business/ResetPassword",
	component: BusinessResetPassword,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: "color" },
	},
};

const Template = (args) => <BusinessResetPassword {...args} />;

// our current primary color is #00bcd4
export const InitialState = Template.bind({});
InitialState.args = {
	// primary: "red",
};
