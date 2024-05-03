/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        redpallete: "#E45F2B",
        bluepallete: "#9AC1F0",
        greenpallete: "#72FA93",
        lightgreenpallete: "#A0E548",
        yellowpallete: "#F6C445",
      },
    },
  },
  plugins: [],
};
