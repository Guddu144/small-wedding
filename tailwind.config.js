/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{ts,tsx}',
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
    ],
    theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0a1a33',
          950: '#061224',
        },
        'gold': {
          400: '#c8a45c',
          500: '#b08d45',
        },
      },
      fontFamily: {
        'serif': ['var(--font-lora)', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        'sans': ['var(--font-montserrat)', 'var(--font-poppins)', 'Helvetica', 'Arial', 'sans-serif'],
        'lora': ['var(--font-lora)', 'serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'funnel': ['"Funnel Display"', 'sans-serif'],
        'modak': ['Modak', 'cursive'],
      },
    },
  },
    plugins: [],
  }
  