/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        toto: '#F8F8F8',
        'pink': {
          DEFAULT: '#FFECF6',
          '20': 'rgba(255, 236, 246, 0.2)', // 50% d'opacité
          '50': 'rgba(255, 236, 246, 0.4)', // 50% d'opacité
          '75': 'rgba(255, 236, 246, 0.75)', // 75% d'opacité
          '90': 'rgba(255, 236, 246, 0.9)', // 90% d'opacité
        },
        textPimp: '#60A5FA'
      },
      backgroundColor:{
        bluePimp : '#60A5FA',
      },
      height: {
        'screen-minus-64': 'calc(100vh - 64px)',
      },
      minHeight: {
        'screen-minus-64': 'calc(100vh - 64px)',
      },
      borderColor:{
        bluePimp : '#60A5FA',
      }
    },
  },
  plugins: [],
}
