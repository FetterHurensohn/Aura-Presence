/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-900': '#0a0f1e',
        'surface-800': '#151b2e',
        'surface-700': '#1a2235',
        'accent-500': '#6366f1',
        'muted-500': '#94a3b8',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'cyan': '#06b6d4',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      transitionDuration: {
        'base': '200ms',
      },
    },
  },
  plugins: [],
}

