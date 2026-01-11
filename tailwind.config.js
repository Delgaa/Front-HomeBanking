/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Modern Fintech Palette
        primary: {
          DEFAULT: '#1e40af', // Blue 800
          dark: '#1e3a8a',    // Blue 900
          light: '#3b82f6',   // Blue 500
        },
        secondary: {
          DEFAULT: '#0ea5e9', // Sky 500
          dark: '#0284c7',    // Sky 600
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',   // Slate 50
          dark: '#1e293b',    // Slate 800 (for dark cards)
        },
        text: {
          main: '#0f172a',    // Slate 900
          muted: '#64748b',   // Slate 500
          light: '#f1f5f9',   // Slate 100
        }
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}
