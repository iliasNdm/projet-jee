/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          gold: '#D4AF37',
          black: '#1A1A1A',
          gray: '#2C2C2C',
          light: '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
}
