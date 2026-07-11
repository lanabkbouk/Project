/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        primary :'#FD7E14',
        secondary:'black',
        gray:{
          100:'#F8F9FA',
          600:'#6C757D'
        }
      }
    },
  },
  plugins: [],
}

