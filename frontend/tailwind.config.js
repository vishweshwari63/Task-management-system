/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          text: '#F8FAFC',
          border: '#334155'
        },
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#0F172A',
          border: '#E2E8F0'
        },
        brand: {
          primary: '#6366F1', // Indigo
          success: '#22C55E', // Green
          warning: '#F59E0B', // Amber
          danger: '#EF4444',  // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(99, 102, 241, 0.05)',
      }
    },
  },
  plugins: [],
}
