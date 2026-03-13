/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#9A6767',
        background: '#E0D2BF',
        accent: '#9A6767',
      },
      fontFamily: {
        serif: ['serif'],
        sans: ['sans-serif'],
      },
    },
  },
  plugins: [],
}