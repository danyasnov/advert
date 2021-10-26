const plugin = require('tailwindcss/plugin')
const lineClamp = require('@tailwindcss/line-clamp')
const typography = require('@tailwindcss/typography')
const tooltipArrow = require('tailwindcss-tooltip-arrow-after')

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
      'h-1': ['36px', '40px'],
      'h-2': ['20px', '24px'],
      'h-3': ['18px', '20px'],
      'h-4': ['16px', '20px'],
      'h-5': ['14px', '16px'],
    },
    screens: {
      xs: '576px',
      s: '768px',
      m: '1024px',
      l: '1360px',
    },
    extend: {
      borderRadius: {
        2: '0.5rem',
        6: '1.5rem',
        12: '3rem',
      },
      spacing: {
        4.5: '1.125rem',
        9.5: '2.375rem',
        15: '3.75rem',
        18: '4.5rem',
        26: '6.5rem',
        29: '7.25rem',
        31: '7.75rem',
        34: '8.5rem',
        35: '8.75rem',
        38: '9.5rem',
        49: '12.25rem',
        50: '12.5rem',
        53: '13.25rem',
        54: '13.5rem',
        58: '14.5rem',
        73: '18.25rem',
        74: '18.5rem',
        82: '20.5rem',
        86: '21.5rem',
        100: '25rem',
        110: '27.5rem',
        '7px': '7px',
        '3.5px': '3.5px',
        '33px': '33px',
        '250px': '250px',
        '288px': '288px',
        '320px': '320px',
        '328px': '328px',
        '480px': '480px',
        '596px': '596px',
        '608px': '608px',
        '680px': '680px',
        '704px': '704px',
        '768px': '768px',
        '896px': '896px',
        '944px': '944px',
        '1024px': '1024px',
        '1208px': '1208px',
        '1360px': '1360px',
        '95%': '95%',
      },
      gridTemplateColumns: {
        'category-selector-m': '202px 202px 202px 336px',
        'category-selector-l': '298px 299px 299px 312px',
      },
      colors: {
        'brand-a1': '#FF9514',
        'brand-a2': '#FFEEDD',
        'brand-b1': '#1E4592',
        'shadow-overlay': 'rgba(12, 13, 13, 0.4)',
        'shadow-a': 'rgba(12, 13, 13, 0.2)',
        'shadow-b': 'rgba(12, 13, 13, 0.1)',
        'black-a': '#0C0D0D',
        'black-b': '#3D3F43',
        'black-c': '#7C7E83',
        'black-d': '#BDBEC2',
        'black-e': '#F8F8F8',
        'black-f': '#A8ABB0',
        'white-a': '#FFFFFF',
        'white-b': 'rgba(255, 255, 255, 0.6)',
        'white-d': 'rgba(12, 13, 13, 0.2)',
        'image-placeholder': 'rgb(234,233,233)',
        'notification-success': 'rgba(0, 163, 0, 1)',
        'notification-info': '#80B2FF',
        error: '#CC3237',
      },
      inset: {
        '89px': '89px',
        '105px': '105px',
        '81px': '81px',
      },
      maxHeight: {},
      maxWidth: {
        '100px': '100px',
        44: '11rem',
        64: '16rem',
      },
      minHeight: {
        10: '2.5rem',
        '1/2': '50vh',
        '2/3': '66vh',
      },
      minWidth: {
        10: '2.5rem',
        40: '10rem',
        52: '13rem',
      },
      outline: {
        'brand-a1': ['2px solid #FF9514', '1px'],
      },
      backgroundImage: () => ({
        'adverto-background': "url('/img/adverto-background.png')",
      }),
    },
    tooltipArrows: (theme) => ({
      arrow: {
        borderColor: theme('colors.white'),
        borderWidth: 1,
        backgroundColor: theme('colors.white'),
        size: 10,
        offset: 150,
      },
      'location-popup-arrow': {
        borderColor: theme('colors.white'),
        borderWidth: 1,
        backgroundColor: theme('colors.white'),
        size: 10,
        offset: 70,
      },
    }),
  },
  variants: {
    extend: {
      fontWeight: ['first'],
      margin: ['first'],
      borderRadius: ['first', 'last'],
      borderWidth: ['first', 'last'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      position: ['focus']
    },
  },
  plugins: [capitalizeFirst, lineClamp, typography, tooltipArrow()],
}
