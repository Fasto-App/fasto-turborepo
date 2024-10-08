const path = require('path');

module.exports = {
	i18n: {
		locales: ['en', 'pt', 'es'],
		defaultLocale: 'en',
		...(typeof window === undefined ? { localePath: path.resolve('./public/locales') } : {}),
	},
};
