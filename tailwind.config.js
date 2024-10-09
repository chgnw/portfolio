/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm' : '370px',
        'md' : '600px',
        'lg' : '768px',
        'xl' : '1024px',
        '2xl' : '1280px',
        '3xl' : '1440px',
      },
      fontFamily: {
        'roboto' : ['Roboto', 'sans-serif']
      },
      colors: {
        'bgd-d' : '#111827',
        'txt-d' : '#adb7c7',
        'acc-d' : '#1d4ed8',
        'bgd-l' : '#F3F4F6',
        'txt-l' : '#374151',
        'acc-l' : '#646CFF',
      },
    },
  },
  plugins: [],
}

