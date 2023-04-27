const path = require('path');

module.exports = {
	i18n: {
		locales: ['en', 'pt', 'es'],
		defaultLocale: 'en',
		debug: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
		...(typeof window === undefined ? { localePath: path.resolve('./public/locales') } : {}),
	},
};
