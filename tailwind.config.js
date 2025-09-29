/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./*.{js,ts,tsx}"],

	presets: [require("nativewind/preset")],
	theme: {
		extend: {}
	},
	plugins: []
};
