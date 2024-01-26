//@ts-nocheck
import React from "react";
import { AddMoreButton } from "../../components/atoms/AddMoreButton";
import { StoryProvider } from "../StoryProvider";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Components/AddMoreButton",
	component: AddMoreButton,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: "color" },
	},
};

const Template = (args) => <AddMoreButton {...args} />;

export const InitialState = Template.bind({});
