// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode - Earthy Tones
        'background-light': '#F8F5F2',
        'text-light': '#4A4441',
        'primary-light': '#D4A373',
        'card-light': '#FFFFFF',
        'accent-light': '#A37E61',

        // Dark Mode
        'background-dark': '#1C1C1C',
        'text-dark': '#E5E5E5',
        'primary-dark': '#E0B589',
        'card-dark': '#2A2A2A',
        'accent-dark': '#C89F76',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'spin-slow': 'spin 6s linear infinite',
      }
    },
  },
  plugins: [],
}
export default config