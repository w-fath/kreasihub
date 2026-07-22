/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Deep Indigo
          light: '#3B82F6',   // Electric Blue
        },
        neutral: {
          light: '#F9FAFB',   // Light Gray
          dark: '#111827',    // Slate
          white: '#FFFFFF',
        },
        accent: {
          success: '#10B981', // Success Green
          error: '#EF4444',   // Error Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
