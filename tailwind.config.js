// @type {import('tailwindcss').Config}
const plugin = require('tailwindcss/plugin');
const animatecss = require('tailwindcss-animatecss');

module.exports = {
  darkMode: 'class',

  content: [
    // 🧠 Jinja2 / Flask templates
    './templates/**/*.html',
    './templates/**/*.js',

    // 🎨 Static assets
    './static/js/**/*.js',
    './static/css/**/*.css',

    // ❌ Exclude node_modules
    '!./node_modules/**/*',
  ],

  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
    },

    extend: {
      colors: {
        night: {
          DEFAULT: '#0f111a',
          75: 'rgba(15,17,26,0.75)',
          glow: '#151827',
          phantom: '#090a11',
        },
        orangeLuxe: {
          DEFAULT: '#ff7f00',
          light: '#ff9350',
          dark: '#cc6600',
        },
        emeraldLuxe: '#34d399',
        cyberNight: '#0f111a',
        cyberNightGlow: '#151827',
        cyberNightPhantom: '#090a11',
        cyan: '#22d3ee',
        magenta: '#ec4899',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },

      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },

      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
      },

      boxShadow: {
        'glow-orange': '0 0 30px rgba(249,113,16,0.4)',
        'hud-panel': '0 0 40px rgba(255,127,0,0.2)',
        skull: '0 0 6px rgba(255,127,0,0.9), 0 0 12px rgba(255,200,100,0.6)',
      },

      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },

      backgroundImage: {
        shimmer:
          'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
      },

      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        lensFlicker: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        warpBlur: {
          '0%,100%': {
            transform: 'scale(1) translate(0)',
            opacity: '0.88',
          },
          '50%': {
            transform: 'scale(1.1) translate(-10px,-10px)',
            opacity: '0.98',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        spinReverse: 'spinReverse 12s linear infinite',
        lensFlicker: 'lensFlicker 3s ease-in-out infinite',
        'spin-slow': 'spin 60s linear infinite',
        'spin-slower': 'spin 120s linear infinite',
        'spin-slowest': 'spin 180s linear infinite',
        warpBlur: 'warpBlur 30s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },

  safelist: [
    'scroll-shadow',
    'opacity-0',
    'opacity-100',
    'btn--primary',
    'btn--secondary',
    'btn--outline',
    'warp-overlay',
    'hover-lift',
    'animated-border',
    'ghost-cursor',
    'animate-pulse-glow',
    'animate-neon-flicker',
    'animate-warpStabilize',
    'orbit',
    'orbit--small',
    'orbit--med',
    'orbit--large',
    'orbit-container',
    'lens-flare',
    'glitch',
  ],

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    animatecss,

    plugin(({ addComponents, addUtilities }) => {
      addComponents({
        '.orbit-container': {
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
        },
        '.orbit': {
          position: 'absolute',
          border: '1px solid rgba(255,127,0,0.4)',
          borderRadius: '9999px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        '.orbit--small': {
          width: '6rem',
          height: '6rem',
          animation: 'spin 8s linear infinite',
        },
        '.orbit--med': {
          width: '10rem',
          height: '10rem',
          animation: 'spinReverse 12s linear infinite',
        },
        '.orbit--large': {
          width: '14rem',
          height: '14rem',
          animation: 'spin 20s linear infinite',
        },
        '#lensFlare': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20rem',
          height: '20rem',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(255,255,200,0.4) 0%, transparent 60%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          animation: 'lensFlicker 3s ease-in-out infinite',
        },
        '.glitch': {
          position: 'relative',
          color: 'white',
        },
        '.glitch::before, .glitch::after': {
          content: 'attr(data-text)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
        },
        '.glitch::before': {
          left: '2px',
          textShadow: '-2px 0 #f97316',
          animation: 'glitch 1.5s infinite alternate-reverse',
        },
        '.glitch::after': {
          left: '-2px',
          textShadow: '2px 0 #22d3ee',
          animation: 'glitch 1.5s infinite alternate',
        },
      });

      addUtilities({
        '.perspective-600': {
          perspective: '600px',
        },
        '.hero-skull': {
          filter:
            'drop-shadow(0 0 5px var(--skull-glow)) drop-shadow(0 0 12px var(--skull-stroke))',
        },
      });
    }),
  ],
};

