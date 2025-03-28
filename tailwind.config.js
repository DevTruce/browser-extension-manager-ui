/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.js'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    extend: {
      colors: {
        neutral900: 'hsl(227, 75%, 14%)',
        neutral800: 'hsl(226, 25%, 17%)',
        neutral700: 'hsl(225, 23%, 24%)',
        neutral600: 'hsl(226, 11%, 37%)',
        neutral300: 'hsl(0, 0%, 78%)',
        neutral200: 'hsl(217, 61%, 90%)',
        neutral100: 'hsl(0, 0%, 93%)',
        neutral0: 'hsl(200, 60%, 99%)',

        red700: 'hsl(3, 77%, 44%)',
        red500: 'hsl(3, 71%, 56%)',
        red400: 'hsl(3, 86%, 64%)',
      },

      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },

      backgroundImage: {
        lightGradient: 'linear-gradient(180deg, #EBF2FC 0%, #EEF8F9 100%)',
        darkGradient: 'linear-gradient(180deg, #040918 0%, #091540 100%)',
      },
    },
  },
  plugins: [],
};
