/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- Bu satırın olduğundan %100 emin ol
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--bg-color)',
          card: 'var(--card-color)',
          text: 'var(--text-color)',
          accent: 'var(--accent-color)',
        }
      }
    },
  },
  plugins: [],
}