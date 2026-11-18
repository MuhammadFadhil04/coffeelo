/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          cream: '#F4EDE5',
          dark: '#451B0E',
          brown: '#71351D',
          orange: '#B6370B',
          beige: '#E5D4C6',
          white: '#FFFFFF',
          // Additional soft shades for subtle borders & cards
          'cream-light': '#FAF6F0',
          'beige-subtle': '#EFE4DA',
          'dark-surface': '#2E120A',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(69, 27, 14, 0.05)',
        'card': '0 10px 30px -4px rgba(69, 27, 14, 0.08)',
        'elevation': '0 20px 40px -10px rgba(69, 27, 14, 0.12)',
      },
    },
  },
  plugins: [],
}
