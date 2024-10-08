module.exports = {
	'stories': ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	'addons': [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-react-native-web',
		'storybook-addon-next-router',
	],
	'framework': '@storybook/react',
	'core': {
		'builder': '@storybook/builder-webpack5',
	},
};
