/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mystical: {
          900: '#0d0521',
          800: '#1a0a2e',
          700: '#2d1557',
          600: '#3d1f73',
          500: '#5a2d9e',
          400: '#7b4fc4',
          300: '#a67de8',
          200: '#c9a8f5',
          100: '#e8d8fc',
        },
        gold: {
          500: '#d4af37',
          400: '#e6c84a',
          300: '#f0d96a',
          600: '#b8962e',
          700: '#9a7d24',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3), 0 0 10px rgba(212, 175, 55, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37, #f0d96a, #d4af37)',
        'mystical-gradient': 'linear-gradient(180deg, #0d0521, #1a0a2e, #2d1557)',
      },
    },
  },
  plugins: [],
}
