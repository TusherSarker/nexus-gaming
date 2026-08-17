/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus': {
          950: '#07080c',
          900: '#0b0d13',
          850: '#0f1118',
          800: '#131620',
          700: '#191d2a',
          600: '#232838',
          500: '#2f3549',
        },
        'cyan-accent': '#d47f97', // Primary Dusky Pink
        'dusky-pink': '#d47f97',
        'dusky-pink-light': '#e8a4b6',
        'dusky-pink-dark': '#b56078',
        'dusky-pink-muted': 'rgba(212, 127, 151, 0.15)',
        'magenta-accent': '#e06d92',
        'gold-accent': '#f2c4ce',
        'success': '#34d399',
        'text-primary': '#f8f8fa',
        'text-secondary': '#a29db0',
        'text-muted': '#6b667a',
      },
      fontFamily: {
        'heading': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(212, 127, 151, 0.35), 0 0 60px rgba(212, 127, 151, 0.12)',
        'glow-cyan-sm': '0 0 12px rgba(212, 127, 151, 0.25)',
        'glow-cyan-lg': '0 0 30px rgba(212, 127, 151, 0.45), 0 0 80px rgba(212, 127, 151, 0.18)',
        'glow-pink': '0 0 20px rgba(212, 127, 151, 0.35), 0 0 60px rgba(212, 127, 151, 0.12)',
        'glow-magenta': '0 0 20px rgba(224, 109, 146, 0.3), 0 0 60px rgba(224, 109, 146, 0.1)',
        'glow-gold': '0 0 20px rgba(242, 196, 206, 0.3), 0 0 60px rgba(242, 196, 206, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.45)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-arrow': 'bounce-arrow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-arrow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 60% 40%, rgba(212, 127, 151, 0.09) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
