import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "theme-white":"#fef4e5",
        "theme-white-dark": "#1d1b1c",
        "theme-main": "#00db96",
        "theme-text": "#e66550",
      },
      animation: {
        'openModal': 'modal-open 0.25s ease forwards',
        'closeModal': 'modal-close 0.25s ease forwards',
        'md-openModal': 'md-modal-open 0.25s ease forwards',
        'md-closeModal': 'md-modal-close 0.25s ease forwards',
      },  
      keyframes: {
        "modal-open": {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        "modal-close": {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        "md-modal-open": {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        "md-modal-close": {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
