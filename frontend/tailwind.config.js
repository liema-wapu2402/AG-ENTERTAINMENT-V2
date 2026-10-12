/** @type {import('tailwindcss').Config} */
// Colours come from CSS variables (see src/index.css) so the whole app
// switches between dark and light mode by toggling the `dark` class on <html>.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        elevated: token('elevated'),
        sidebar: token('sidebar'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-fg': token('accent-fg'),
        // module palette: two colours per module (see [data-module] in index.css)
        m1: token('m1'),
        m2: token('m2'),
      },
      fontFamily: { sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        equalizer: { '0%,100%': { transform: 'scaleY(0.25)' }, '50%': { transform: 'scaleY(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .5s ease-out both',
        'fade-in': 'fade-in .3s ease-out both',
        'spin-slow': 'spin-slow 10s linear infinite',
        equalizer: 'equalizer 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
