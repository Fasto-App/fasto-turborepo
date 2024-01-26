//@ts-nocheck
import React from "react";
import { CreateAccountScreen } from "../../business-templates/CreateaAccount";
import { StoryProvider } from "../StoryProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Business/CreateAccount",
	component: CreateAccountScreen,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: "color" },
	},
};

const Template = (args: {}) => <CreateAccountScreen {...args} />;

export const InitialState = Template.bind({});
InitialState.args = {
	// primary: "red",
};

InitialState.story = {
	parameters: {
		nextRouter: {
			path: "/profile/[id]",
			asPath: "/profile/lifeiscontent",
			query: {
				token: "lifeiscontent",
				email: "test@gmail.com",
			},
		},
	},
};
