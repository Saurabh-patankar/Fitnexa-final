/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        neonBlue: "#00f0ff",
        neonGreen: "#00ff94",
        neonPink: "#ff00a8",
        textLight: "#f1f1f1",
        card: "#1a1a1a",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0,240,255,0.5), 0 0 20px rgba(0,240,255,0.4)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0,240,255,0.8), 0 0 40px rgba(0,240,255,0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}