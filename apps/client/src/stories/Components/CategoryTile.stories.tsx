//@ts-nocheck
import React from "react";
import { CategoryTile } from "../../components/Category/Category";
import { StoryProvider } from "../StoryProvider";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: "Components/CategoryTile",
	component: CategoryTile,
	decorators: [StoryProvider],
	argTypes: {
		selected: { control: "boolean" },
	},
};

const Template = (args) => <CategoryTile {...args} />;

export const InitialState = Template.bind({});
InitialState.args = {
	category: {
		name: "Lunch Special",
	},
	selected: true,
};
