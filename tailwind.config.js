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
      keyframes: {
        "scroll-text": {
          "100%": {transform: "translateX(100%)"},
          "-100%": {transform: "translateX(-100%)"} 
        },
        "show-volume": {
          "100%": {transform: "translateX(100%)"}
        },
        "hide-volume": {
          "0%": {transform: "translateX(0px)"}
        },
      },
      animation:{
        "scroll-text":"scroll-text 15s linear infinite",
        "show-volume":"show-volume 1.5s linear 1 forward",
        "hide-volume":"hide-volume 1.5s linear 1 forward"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};