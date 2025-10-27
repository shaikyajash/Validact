/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        dropdown: {
          '0%': { opacity: 0, transform: 'scaleY(0.95)' },
          '100%': { opacity: 1, transform: 'scaleY(1)' }
        }
      },
      animation: {
        dropdown: 'dropdown 0.2s ease-out'
      }
    },
  },
  plugins: [],
}

