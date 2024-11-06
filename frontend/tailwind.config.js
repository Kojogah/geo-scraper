/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slides: {
          '0%, 100%': {transform: 'translateX(-100%)'},
          '50%': {transform: 'translateX(100%)'},
        },
      },
      animation: {
        slide: 'slide 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

