/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        klt_primary: {
          100: '#599b87',
          200: '#559f89',
          300: '#4fa68c',
          400: '#44a689',
          500: '#38a383',
          600: '#2d9777',
          700: '#259976',
          800: '#188f6b',
          900: '#07845e'
        }
      }
    },
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
  },
} 