/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a'
        },
        foreground: {
          DEFAULT: '#000000',
          dark: '#f8fafc'
        }
      }
    }
  },
  plugins: []
}
