/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        success: '#10b981',
        warning: '#f97316',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
