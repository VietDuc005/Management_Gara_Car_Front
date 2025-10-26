/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: "class", 
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
       animation: {
    "spin-fast": "spin .6s linear infinite",
    "spin-slow": "spin 2s linear infinite",
    "spin-reverse": "spin 1.3s linear infinite reverse",
    fadeIn: "fadeIn .35s ease-in-out",
  },
  keyframes: {
    fadeIn: {
      "0%": { opacity: 0 },
      "100%": { opacity: 1 },
    },
  },
    },
  },
  plugins: [],
};
