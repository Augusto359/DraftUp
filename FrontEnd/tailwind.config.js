/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso avisa o Tailwind para olhar seus arquivos .jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}