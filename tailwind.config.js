const screens = require('./tailwind.screens.config')

module.exports = {
  screens,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: ['outline-none'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '1920px',
      },
      screens: {
        '3xl': '1600px',
        'not-tall': { raw: '(max-height: 850px)' },
        'high-dpi': { raw: '(min-resolution: 97dpi)' },
        'very-high-dpi': { raw: '(min-resolution: 130dpi)' },
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        quaternary: 'var(--quaternary)',
        quinary: 'var(--quinary)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
    },
  },
}
