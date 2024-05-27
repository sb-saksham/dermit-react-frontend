/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            primaryBlue: "#3498db",
            primaryGray: "#eaeaea",
            primaryGreen: "#0A6847",
        },
    },
},
  plugins: [],
}

