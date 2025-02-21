/** @type {import('tailwindcss').Config} */
// const plugin = require("tailwindcss/plugin");
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      animation: {},
      keyframes: {}
    },
    screens: {
      base: '0em',
      md: '887px'
    },
    colors: {
      black: {
        200: '#282828'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
