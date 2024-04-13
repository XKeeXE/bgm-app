const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['IBMSansJPP']
      },
      keyframes: {
        "scroll-text": {
          "100%": {transform: "translateX(100%)"},
          "-100%": {transform: "translateX(-100%)"} 
        },
        "show-volume": {
          "100%": {transform: "translateX(0px)"}
        },
        "hide-volume": {
          "0%": {transform: "translateX(0px)"}
        },
      },
      animation:{
        "scroll-text":"scroll-text 15s linear infinite"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};