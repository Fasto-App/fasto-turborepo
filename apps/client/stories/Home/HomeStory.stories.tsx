//@ts-nocheck
import React from "react";
import { StoryProvider } from "../StoryProvider";
import Home from "../../pages";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Home/Home",
	component: Home,

	decorators: [StoryProvider],
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		backgroundColor: { control: "color" },
	},
};

const Template = (args) => <Home {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	primary: true,
	label: "Built using github actions",
};
