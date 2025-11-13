/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#012646',
        secondary: '#EEEEEE',
      },
      backgroundImage: (theme) => ({
        "bible": "url('/assets/images/bible.jpg')",
      }),
      fontFamily: {
        bioRhyme: ['Bio Rhyme', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
    screens: {
      xs: '480px',
      sm: '768px',
      md: '1060px',
    }
  },
  plugins: [],
}

