/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./views/**/*.ejs'],
	theme: {
		extend: {
			colors: {
				primaryColor: '#29844B',
				primaryColorShade: '#0e406e',
				secondaryColor: '#A1A0BD',
				secondaryColorShade: '#d1d5db',
				tertiaryColor: '#FC3400',
				tColor: '#84818A',
				tColor2: '#2E2C34',
				tColor3: '#504F54',
			},
			fontFamily: {
				mulish: 'Mulish',
				helvetica: 'Helvetica',
			},
		},
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#29844B',
					'base-100': '#ffffff',
				},
			},
		],
	},

	plugins: [
		require('daisyui'),
		function ({ addBase }) {
			addBase({
				h1: { fontSize: '4.0rem' },
				h2: { fontSize: '3.5rem' },
				h3: { fontSize: '3.0rem' },
				h4: { fontSize: '2.5rem' },
				h5: { fontSize: '2.0rem' },
				h6: { fontSize: '1.5rem' },
			});
		},
	],
};
