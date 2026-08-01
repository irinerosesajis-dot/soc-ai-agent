/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070B14',
          surface: '#0F172A',
          card: '#161F33',
          cardHover: '#1E2942',
          border: '#2A364F',
          borderGlow: '#06B6D4',
          accent: '#06B6D4',
          accentGlow: 'rgba(6, 182, 212, 0.25)',
          purple: '#8B5CF6',
          danger: '#F43F5E',
          success: '#10B981',
          warning: '#F59E0B',
          muted: '#64748B',
          text: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'danger-glow': '0 0 20px -5px rgba(244, 63, 94, 0.3)',
        'success-glow': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
