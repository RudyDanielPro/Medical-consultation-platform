/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta médica profesional
        medblue: {
          50: '#f0f7ff',   // Azul muy claro (fondos)
          100: '#e0f2fe',
          200: '#bae6fd',  // Azul claro (bordes)
          400: '#38bdf8',  // Azul interactivo (hover)
          500: '#0ea5e9',  // Azul principal (botones)
          600: '#0284c7',  // Azul oscuro (navbar/títulos)
          800: '#075985',  // Azul muy oscuro (textos)
        },
        medgreen: {
          400: '#16a34a',  // Verde médico (acentos)
          500: '#15803d',  // Verde oscuro (hover)
        },
        medgray: {
          100: '#f3f4f6',  // Gris claro (fondos secundarios)
          300: '#d1d5db',  // Gris bordes
          700: '#374151',  // Gris texto
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fuente moderna
      },
    },
  },
  plugins: [],
}