import daisyui from 'daisyui'
import scrollbar from 'tailwind-scrollbar'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Allows to use font-serif or font-sans classes
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    daisyui,
    scrollbar,
  ],
  daisyui: {
    themes: ['light'],
  },
}

