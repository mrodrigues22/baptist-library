/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#012646',
        lighter: '#023E8A',
        secondary: '#EEEEEE',
      },
      backgroundImage: (theme) => ({
        "bible": "url('/assets/images/bible.jpg')",
      }),
      fontFamily: {
        bioRhyme: ['BioRhyme', 'serif'],
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

