import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      colors: {
        ivory: "#faf9f7",
        sand: {
          DEFAULT: "#c8b89a",
          light: "#f0ece6",
          dark: "#7a6a52",
        },
        slate: {
          border: "#eae8e4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
