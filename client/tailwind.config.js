/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e8f2fb',
          100: '#d1e5f5',
          500: '#18588c',
          600: '#123d63',
          700: '#09243f',
        },
        slate: {
          950: '#0f172a',
        },
        success: '#ea580c',
        warning: '#f97316',
        danger: '#dc2626',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
