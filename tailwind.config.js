/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#cc0000",
          100: "#d98880",
        },
        blue: {
          DEFAULT: "#3b4cca",
          100: "#eef1f6",
        },
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#424245",
        },
        yellow: "#ffde00",
        white: "#f6f9fd",
      },
    },
  },
  plugins: [],
};
