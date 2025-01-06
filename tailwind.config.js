/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,css}", 
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#3d7692',
        primary: '#113c53',
        green: '#4eaf8f',
        warning: '#2581cc',
        red: '#d1302b',
        danger: '#d1302b'
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), 'flowbite/plugin', 'preline/plugin'],
}

