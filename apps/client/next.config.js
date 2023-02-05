const { withExpo } = require('@expo/next-adapter');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
	'react-native-web',
	'react-native-svg',
	'native-base',
	'react-native-svg',
	'react-native',
	'app-helpers',
]);

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	env: {
		NEXT_PUBLIC_ENVIRONMENT: process.env.ENVIRONMENT,
		NEXT_PUBLIC_API_KEY: process.env.API_KEY,
		BACKEND_URL: process.env.BACKEND_URL,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
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
