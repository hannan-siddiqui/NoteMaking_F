/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: {
            light: '#ffffff',
            dark: '#191919',
          },
          sidebar: {
            light: '#f7f7f5',
            dark: '#202020',
          },
          hover: {
            light: '#efefed',
            dark: '#2b2b2b',
          },
          border: {
            light: '#e9e9e7',
            dark: '#2e2e2e',
          },
          card: {
            light: '#ffffff',
            dark: '#242424',
          },
          text: {
            light: '#37352f',
            dark: '#ffffff',
            mutedLight: '#787774',
            mutedDark: '#9b9b9b',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          '"Apple Color Emoji"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'modal': '0 10px 30px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
