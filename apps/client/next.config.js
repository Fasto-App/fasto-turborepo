const { withExpo } = require('@expo/next-adapter');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
	'react-native-web',
	'react-native-svg',
	'native-base',
	'react-native-svg',
	'react-native',
]);

const nextConfig = {
	env: {
		NEXT_PUBLIC_ENVIRONMENT: process.env.ENVIRONMENT,
		NEXT_PUBLIC_API_KEY: process.env.API_KEY,
	},
};

module.exports = withPlugins(
	[
		withTM,
		[withFonts, { projectRoot: __dirname }],
		[withExpo, { projectRoot: __dirname }],
		// []
		// your plugins go here.
	],
	nextConfig,
);
