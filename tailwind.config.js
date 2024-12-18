/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	important: '#root', // This helps prevent conflicts with MUI
	theme: {
		extend: {},
	},
	corePlugins: {
		// Disable Preflight as it can conflict with MUI
		preflight: false,
	},
	plugins: [],
};
