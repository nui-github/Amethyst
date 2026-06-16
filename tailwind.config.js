/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        // PRIMARY BLUE SHADES — base #010136
        navy: {
          light:   '#8080A5',
          mid:     '#40406A',
          DEFAULT: '#010136',
          dark:    '#00001A',
          deeper:  '#00000D',
        },
        // SECONDARY BLUE SHADES — base #0463EF
        blue: {
          light:   '#B0D0FF',
          soft:    '#70A0F0',
          DEFAULT: '#0463EF',
          deep:    '#034DBA',
          darker:  '#02388C',
        },
        // ACCENT GREEN SHADES — base #16EA9E
        teal: {
          light:   '#B0FFF0',
          soft:    '#70E5C0',
          DEFAULT: '#16EA9E',
          mid:     '#11BB7F',
          dark:    '#0D8F61',
        },
        // NEUTRAL SHADES
        neutral: {
          white:   '#FFFFFF',
          50:      '#F9F9F9',
          100:     '#F0F0F0',
          200:     '#E0E0E0',
          300:     '#CCCCCC',
          500:     '#999999',
          600:     '#666666',
          800:     '#333333',
        },
      },
      animation: {
        'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
        'slide-up':   'slide-up 0.25s ease-out',
        'fade-in':    'fade-in 0.2s ease-out',
        'spin-slow':  'spin 1s linear infinite',
      },
      keyframes: {
        'pulse-dot':  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        'bounce-dot': { '0%,60%,100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-6px)' } },
        'slide-up':   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':    { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      boxShadow: {
        'bizx':   '0 4px 20px rgba(4,99,239,0.18)',
        'card':   '0 2px 10px rgba(1,1,54,0.08)',
        'modal':  '0 20px 60px rgba(1,1,54,0.22)',
        'teal':   '0 4px 16px rgba(22,234,158,0.25)',
        'navy':   '0 4px 16px rgba(1,1,54,0.3)',
      },
    },
  },
  plugins: [],
}
