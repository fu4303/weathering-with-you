/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('windicss/colors')

module.exports = {
  darkMode: 'class',
  plugins: [
    require('windicss/plugin/typography'),
  ],
  theme: {
    extend: {
      colors: {
        wwy: {
          100: '#4E3B5A',
          200: '#1C2634',
          300: '#2F3838',
          400: '#BFC1A8',
          500: '#313d38',
          600: '#284D49',
          700: '#091010',
        },
        gruvbox: {
          100: '#fbf1c7',
          200: '#ebdbb2',
          300: '#d5c4a1',
          400: '#bdae93',
          500: '#a89984',
          600: '#665c54',
          700: '#32302f',
          800: '#282828',
          900: '#1d2021',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              opacity: 0.75,
              fontWeight: '500',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 1,
                color: colors.teal[600],
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
}
