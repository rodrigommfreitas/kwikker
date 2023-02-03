/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          light: "#71767B",
          medium: "#202327",
          dark: "#16181C",
        },
        blue: {
          light: "#1D9BF0",
          primary: "#1D9BF0",
        },
      },
    },
  },
  plugins: [],
};
