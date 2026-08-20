/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',   // ← make sure this is here
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        primary: 'var(--primary)',
        // RGB-triplet vars via rgb(... / <alpha-value>) so opacity modifiers
        // like bg-critical/20 work. Severity scale mirrors crisiswatch-api's
        // utils/severity.js.
        'accent-purple': 'rgb(var(--accent-purple) / <alpha-value>)',
        critical: 'rgb(var(--critical) / <alpha-value>)',
        high: 'rgb(var(--high) / <alpha-value>)',
        medium: 'rgb(var(--medium) / <alpha-value>)',
        low: 'rgb(var(--low) / <alpha-value>)',
        informational: 'rgb(var(--informational) / <alpha-value>)',
      },
    },
  },
};