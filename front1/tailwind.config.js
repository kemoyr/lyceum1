/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a237e',
          hover: '#303f9f',
        },
        success: {
          DEFAULT: '#4caf50',
          hover: '#388e3c',
        },
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} 