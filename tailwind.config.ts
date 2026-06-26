import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00FF00',
        purple: '#C77DFF',
        purple2: '#7B2FBE',
        black: '#050505',
        card: '#0A0A0A',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'scroll-line': 'scroll-line 1.5s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'aurora': 'aurora 20s linear infinite',
        'mesh': 'mesh 15s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'spin-slow': {
          'from': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          'to': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'scroll-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(300%)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,255,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.2)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        'aurora': {
          '0%': { backgroundPosition: '50% 50%, 50% 50%' },
          '100%': { backgroundPosition: '350% 50%, 350% 50%' },
        },
        'mesh': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-10px, 10px)' },
          '75%': { transform: 'translate(-10px, -10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(135deg, #00FF00 0%, #C77DFF 50%, #7B2FBE 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
