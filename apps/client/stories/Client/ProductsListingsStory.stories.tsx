import React from 'react';
import { StoryProvider } from '../StoryProvider';
import { ProductsListingScreen } from '../../client-templates/ProductsListingScreen';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	title: 'Client/Menu',
	component: ProductsListingScreen,
	decorators: [StoryProvider],
	argTypes: {
		primary: { control: 'color' },
	},
};

const Template = (args) => (
	<ProductsListingScreen {...args} />
);

// Does it need NatibeBase?

// our current primary color is #00bcd4
export const InitialState = Template.bind({});
InitialState.args = {
	// primary: "red",
};
