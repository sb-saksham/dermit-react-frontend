const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
  plugins: [nextui()],
}

