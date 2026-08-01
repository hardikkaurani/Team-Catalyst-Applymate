/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Enable dark mode via .dark class on <html>
  theme: {
    extend: {
      colors: {
        'bg-primary-light': '#D5DEEF',
        'bg-primary-dark': '#1F2E47',
        'bg-secondary-light': '#F0F3FA',
        'bg-secondary-dark': '#395886',
        'accent-primary': '#8AAEE0',
        'accent-hover-light': '#638ECB',
        'accent-hover-dark': '#B1C9EF',
        'text-primary-light': '#395886',
        'text-primary-dark': '#F0F3FA',
        'text-secondary-light': '#638ECB',
        'text-secondary-dark': '#D5DEEF',
        'border-light': '#B1C9EF',
        'border-dark': '#638ECB',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(57, 88, 134, 0.05)',
        'md': '0 4px 12px -2px rgba(57, 88, 134, 0.08), 0 2px 6px -1px rgba(57, 88, 134, 0.04)',
        'lg': '0 12px 24px -4px rgba(57, 88, 134, 0.12), 0 4px 12px -2px rgba(57, 88, 134, 0.08)',
      },
    },
  },
  plugins: [],
};
