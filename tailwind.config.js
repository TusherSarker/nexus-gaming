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
          950: '#05050A',
          900: '#0A0A0F',
          850: '#0E0E16',
          800: '#12121A',
          700: '#1A1A2E',
          600: '#24243A',
          500: '#2E2E46',
        },
        'cyan-accent': '#00F0FF',
        'magenta-accent': '#FF006E',
        'gold-accent': '#FFB800',
        'success': '#00FF88',
        'text-primary': '#F0F0F5',
        'text-secondary': '#8888A0',
        'text-muted': '#55556A',
      },
      fontFamily: {
        'heading': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.1)',
        'glow-cyan-sm': '0 0 10px rgba(0, 240, 255, 0.2)',
        'glow-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.15)',
        'glow-magenta': '0 0 20px rgba(255, 0, 110, 0.3), 0 0 60px rgba(255, 0, 110, 0.1)',
        'glow-gold': '0 0 20px rgba(255, 184, 0, 0.3), 0 0 60px rgba(255, 184, 0, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.6)',
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
        'hero-gradient': 'radial-gradient(ellipse at 60% 40%, rgba(0, 240, 255, 0.08) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
