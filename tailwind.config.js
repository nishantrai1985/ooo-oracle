/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        eric: {
          blue: '#0082F0',
          'blue-hover': '#0062BC',
          'blue-deep': '#00427A',
          navy: '#001C3D',
          'navy-light': '#0A2A50',
        },
        summer: {
          sun: '#FFB300',
          'sun-bright': '#FFD740',
          coral: '#FF5140',
          teal: '#00BDD4',
          'teal-dark': '#0097A7',
          sand: '#FFF8E1',
        },
      },
      animation: {
        'sun-pulse': 'sunPulse 4s ease-in-out infinite',
        'ray-spin': 'raySpin 24s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'wave-slow': 'waveSlow 8s ease-in-out infinite',
        'bob': 'bob 5s ease-in-out infinite',
      },
      keyframes: {
        sunPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 16px rgba(255,179,0,0.5))' },
          '50%': { filter: 'drop-shadow(0 0 36px rgba(255,179,0,0.85))' },
        },
        raySpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        waveSlow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-20px)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
