/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          950: "oklch(13% 0.028 261.692)", // Your theme's custom gray-950
        },
        slate: {
          950: "#0f172a", // Tailwind's default slate-950
        },
      },
    },
  },
  plugins: [],
};
