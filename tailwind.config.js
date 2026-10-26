import defaultTheme from "tailwindcss/defaultTheme";

// Colors that change between light and dark mode. The actual values are CSS
// variables in src/index.css (`:root` = light, `.dark` = dark). Written this
// way so opacity modifiers like `bg-ink/30` still work.
const themeColor = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Dark mode is on when <html> has the "dark" class (see useTheme.js).
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        page: themeColor("page"), // app background
        surface: themeColor("surface"), // cards, panels, navbar
        ink: themeColor("ink"), // headings and main text
        subtle: themeColor("subtle"), // body text
        muted: themeColor("muted"), // secondary text (numbers, hints)
        red: {
          DEFAULT: "#ff5350",
          dark: "#cc0000",
        },
        blue: {
          DEFAULT: themeColor("blue"),
          soft: themeColor("blue-soft"),
        },
        yellow: "#ffde00",
        // DEFAULT = badge background, text = badge text
        types: {
          normal: { DEFAULT: "#A8A77A", text: "#54543D" },
          fire: { DEFAULT: "#EE8130", text: "#774118" },
          water: { DEFAULT: "#6390F0", text: "#1f3466" },
          electric: { DEFAULT: "#F7D02C", text: "#7C6816" },
          grass: { DEFAULT: "#7AC74C", text: "#2f4d1d" },
          ice: { DEFAULT: "#96D9D6", text: "#3b5654" },
          fighting: { DEFAULT: "#C22E28", text: "#ffffff" },
          poison: { DEFAULT: "#A33EA1", text: "#ffffff" },
          ground: { DEFAULT: "#E2BF65", text: "#716033" },
          flying: { DEFAULT: "#A98FF3", text: "#3a2c66" },
          psychic: { DEFAULT: "#F95587", text: "#5e1a2f" },
          bug: { DEFAULT: "#A6B91A", text: "#404808" },
          rock: { DEFAULT: "#B6A136", text: "#4a4116" },
          ghost: { DEFAULT: "#735797", text: "#ffffff" },
          dragon: { DEFAULT: "#6F35FC", text: "#ffffff" },
          dark: { DEFAULT: "#705746", text: "#ffffff" },
          steel: { DEFAULT: "#B7B7CE", text: "#4a4a57" },
          fairy: { DEFAULT: "#D685AD", text: "#5a2f44" },
        },
        stats: {
          hp: "#df2140",
          attack: "#ff994d",
          defense: "#eecd3d",
          "special-attack": "#85ddff",
          "special-defense": "#96da83",
          speed: "#fb94a8",
          total: "#7195dc",
        },
      },
    },
  },
  plugins: [],
};
