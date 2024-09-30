/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,css}", 
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#113c53', 
        secondary: '#3d7692',
        blue: '#2581cc',
        green: '#4eaf8f',
        white: '#e5e9ee',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), 'flowbite/plugin'],
}

