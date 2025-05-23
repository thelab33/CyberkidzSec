module.exports = {
  content: ["./templates/**/*.html", "./static/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        orangeLuxe: '#f97316',
        cyberNight: '#0f172a',
        cyberGlow: '#fbbf24',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
