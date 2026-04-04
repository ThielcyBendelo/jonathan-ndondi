/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'], 
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-100': 'var(--color-dark-100)',
        'dark-200': 'var(--color-dark-200)',
        'dark-300': 'var(--color-dark-300)',
        'dark-400': 'var(--color-dark-400)',
      },
      fontFamily: {
        sans: ['Saira', 'sans-serif'],
        antonio: ['Antonio', 'sans-serif'],
      },
      boxShadow: {
        // Subtle depth
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 1px rgb(0 0 0 / 0.05)',
        // Elevated cards
        elevated:
          '0 6px 10px -2px rgb(0 0 0 / 0.25), 0 3px 6px -2px rgb(0 0 0 / 0.2)',
        // Strong pop
        bold: '0 12px 20px -6px rgb(0 0 0 / 0.35), 0 6px 12px -4px rgb(0 0 0 / 0.3)',
        // Neon accents (purple/pink)
        'neon-purple': '0 0 12px 2px rgb(139 92 246 / 0.55)',
        'neon-pink': '0 0 12px 2px rgb(236 72 153 / 0.55)',
        // Inner border glow
        inner: 'inset 0 1px 2px 0 rgb(255 255 255 / 0.04)',
      },
      dropShadow: {
        glow: '0 0 8px rgb(139 92 246 / 0.75)',
      },

      theme: {
    extend: {
      colors: {
        'dark-100': '#1a1a1a', // Assure-toi que tes couleurs sont définies
        'zinc-900': '#18181b',
      }
    }
    }
  },
    },
  plugins: [],
};
