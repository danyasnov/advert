const plugin = require('tailwindcss/plugin')
const lineClamp = require('@tailwindcss/line-clamp')

const capitalizeFirst = plugin(({addUtilities}) => {
  const newUtilities = {
    '.capitalize-first:first-letter': {
      textTransform: 'uppercase',
    },
  }
  addUtilities(newUtilities, ['responsive', 'hover'])
})
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['IBM Plex Sans', 'sans-serif'],
    },
    fontSize: {
      'body-1': ['16px', '20px'],
      'body-2': ['14px', '16px'],
      'body-3': ['12px', '16px'],
      'body-4': ['10px', '12px'],
      'h-2': ['20px', '24px'],
    },
    screens: {
      s: '768px',
      m: '1024px',
      l: '1360px',
    },
    extend: {
      borderRadius: {
        8: '8px',
      },
      spacing: {
        9.5: '2.375rem',
        26: '6.5rem',
        31: '7.75rem',
        34: '8.5rem',
        35: '8.75rem',
        53: '13.25rem',
        74: '18.5rem',
        '33px': '33px',
        '288px': '288px',
        '608px': '608px',
        '896px': '896px',
        '768px': '768px',
        '1024px': '1024px',
        '1360px': '1360px',
      },
      gridTemplateColumns: {
        main: '608px 288px',
      },
      colors: {
        'brand-a1': '#FF9514',
        'brand-a2': '#FFEEDD',
        'brand-b1': '#1E4592',
        'shadow-a': 'rgba(12, 13, 13, 0.2)',
        'shadow-b': 'rgba(12, 13, 13, 0.1)',
        'black-a': '#0C0D0D',
        'black-b': '#3D3F43',
        'black-c': '#7C7E83',
        'black-d': '#BDBEC2',
        'black-e': '#F8F8F8',
        'white-a': '#FFFFFF',
        'white-d': 'rgba(12, 13, 13, 0.2)',
      },
      inset: {
        '89px': '89px',
      },
    },
  },
  variants: {
    extend: {
      margin: ['first'],
      width: ['first'],
      minWidth: ['first'],
    },
  },
  plugins: [capitalizeFirst, lineClamp],
}
