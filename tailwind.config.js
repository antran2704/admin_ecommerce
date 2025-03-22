/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Blue color
        "blue-50": "#F9FBFF",
        "blue-100": "#C5DCFF",
        "blue-200": "#7EB0FF",
        "blue-300": "#3283FF",
        "blue-400": "#0278E7",
        "blue-500": "#115FA4",
        "blue-600": "#12518D",
        "blue-700": "#004483",
        "blue-800": "#022C6E",
        "blue-900": "#001A43",
        "blue-950": "#010F26",

        // Green color
        "green-50": "#EFFFF5",
        "green-100": "#ABD3BB",
        "green-200": "#81BC99",
        "green-300": "#57A677",
        "green-400": "#2D9055",
        "green-500": "#007A54",
        "green-600": "#02662A",
        "green-700": "#025122",
        "green-800": "#013D19",
        "green-900": "#012911",
        "green-950": "#01180A",

        // Orange color
        "orange-50": "#FFF8EB",
        "orange-100": "#FEE4B2",
        "orange-200": "#FED78B",
        "orange-300": "#FECA64",
        "orange-400": "#FDBC3E",
        "orange-500": "#FCAF17",
        "orange-600": "#A9750F",
        "orange-700": "#7E570B",
        "orange-800": "#6B4702",
        "orange-900": "#4E3607",
        "orange-950": "#332305",

        // Red color
        "red-50": "#FFF3F0",
        "red-100": "#FAC4B6",
        "red-200": "#F8A691",
        "red-300": "#F6896C",
        "red-400": "#F36B48",
        "red-500": "#F04E23",
        "red-600": "#C9411D",
        "red-700": "#A13417",
        "red-800": "#782711",
        "red-900": "#501A0C",
        "red-950": "#301007",

        // Gray color
        "gray-50": "#FEFEFE",
        "gray-100": "#F9FAFB",
        "gray-200": "#B5B5B5",
        "gray-300": "#9C9C9D",
        "gray-400": "#7C7C7D",
        "gray-500": "#3A3A3C",
        "gray-600": "#667085",
        "gray-700": "#303032",
        "gray-800": "#1D1D1E",
        "gray-900": "#131314",
        "gray-950": "#0C0C0C",
        "gray-1000": "#F4F4F4"
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    }
  },
  darkMode: 'selector',
  plugins: [],
};
