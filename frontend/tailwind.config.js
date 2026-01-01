/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: '#0B0B0D',
          800: '#121217',
          700: '#1E1E24',
        },
        surface: {
          800: '#121217',
          700: '#1E1E24',
        },
        muted: {
          500: '#6B6B78',
        },
        accent: {
          300: '#A78BFF',
          400: '#7C4DFF',
          500: '#8A63FF',
        },
        cyan: '#00E5FF',
        magenta: '#FF5DA2',
        success: '#44FF9E',
        danger: '#FF5757',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['10px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'modal': '16px',
        'pill': '999px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.35)',
        'md': '0 6px 18px rgba(0, 0, 0, 0.45)',
        'lg': '0 12px 32px rgba(0, 0, 0, 0.55)',
        'xl': '0 20px 48px rgba(0, 0, 0, 0.65)',
        'accent': '0 8px 24px rgba(138, 99, 255, 0.25)',
      },
      transitionDuration: {
        'micro': '100ms',
        'quick': '150ms',
        'base': '220ms',
        'slow': '350ms',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideInUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          from: { transform: 'translateY(-16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(16px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(-16px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 220ms ease-in-out',
        fadeOut: 'fadeOut 220ms ease-in-out',
        slideInUp: 'slideInUp 220ms ease-out',
        slideInDown: 'slideInDown 220ms ease-out',
        slideInLeft: 'slideInLeft 220ms ease-out',
        slideInRight: 'slideInRight 220ms ease-out',
        scaleIn: 'scaleIn 220ms ease-out',
        scaleOut: 'scaleOut 220ms ease-in',
      },
    },
  },
  plugins: [],
}
