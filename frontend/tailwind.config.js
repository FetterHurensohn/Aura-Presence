/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg': {
          900: '#0a0f1e',
          800: '#0d1220',
        },
        // Surface colors
        'surface': {
          900: '#0f1419',
          800: '#151b2e',
          700: '#1a2235',
          600: '#1f2940',
        },
        // Primary/Accent colors
        'accent': {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // Text/Muted colors
        'muted': {
          500: '#94a3b8',
          400: '#cbd5e1',
          300: '#e2e8f0',
        },
        // Status colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'danger': '#dc2626',
        'cyan': '#06b6d4',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      transitionDuration: {
        'base': '200ms',
      },
      transitionProperty: {
        'base': 'all',
      },
    },
  },
  plugins: [],
}

