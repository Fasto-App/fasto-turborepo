/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			colors: {
				// Add new color
				'primary': {
				  '50': '#fff6f5',
				  '100': '#feeeeb',
				  '200': '#fdd4cd',
				  '300': '#fbb9ae',
				  '400': '#f98572',
				  '500': '#f65135',
				  '600': '#f65135', // colorscheme: 'dark'
				  '700': '#b93d28',
				  '800': '#943120',
				  '900': '#79281a'
				},
				'secondary': {
				  '50': '#fefbf9',
				  '100': '#fdf6f3',
				  '200': '#f9e9e1',
				  '300': '#f5dbce',
				  '400': '#eec1aa',
				  '500': '#e7a685',
				  '600': '#d09578',
				  '700': '#ad7d64',
				  '800': '#8b6450',
				  '900': '#715141'
				},
				'tertiary': {
				  '50': '#f9fbfa',
				  '100': '#f4f7f5',
				  '200': '#e3eae5',
				  '300': '#d2ded5',
				  '400': '#b1c5b6',
				  '500': '#8fac97',
				  '600': '#819b88',
				  '700': '#6b8171',
				  '800': '#56675b',
				  '900': '#46544a'
				},
				'info': {
				  '50': '#f6f8fe',
				  '100': '#edf2fe',
				  '200': '#d2defc',
				  '300': '#b7c9f9',
				  '400': '#80a1f5',
				  '500': '#4a79f1',
				  '600': '#436dd9',
				  '700': '#385bb5',
				  '800': '#2c4991',
				  '900': '#243b76'
				},
				'success': {
				  '50': '#f4faf7',
				  '100': '#e9f4ef',
				  '200': '#c9e4d8',
				  '300': '#a8d3c0',
				  '400': '#66b390',
				  '500': '#259261',
				  '600': '#218357',
				  '700': '#1c6e49',
				  '800': '#16583a',
				  '900': '#124830'
				},
				'error': {
				  '50': '#fff4f5',
				  '100': '#ffe9ea',
				  '200': '#ffc8cc',
				  '300': '#ffa7ad',
				  '400': '#ff646f',
				  '500': '#ff2231',
				  '600': '#e61f2c',
				  '700': '#bf1a25',
				  '800': '#99141d',
				  '900': '#7d1118'
				},
				'warning': {
				  '50': '#fffbf3',
				  '100': '#fef7e7',
				  '200': '#fdebc4',
				  '300': '#fbdfa0',
				  '400': '#f9c659',
				  '500': '#f6ae12',
				  '600': '#dd9d10',
				  '700': '#b9830e',
				  '800': '#94680b',
				  '900': '#795509'
				}
			}
		},
	},
	plugins: [require('tailwindcss-animate')],
};
