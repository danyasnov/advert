const plugin = require('tailwindcss/plugin')
const lineClamp = require('@tailwindcss/line-clamp')
const typography = require('@tailwindcss/typography')
const tooltipArrow = require('tailwindcss-tooltip-arrow-after')
const forms = require('@tailwindcss/forms')
const scrollbar = require('tailwind-scrollbar')

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
      sans: ['Euclid'],
    },
    fontSize: {
      'body-10': ['10px', '12px'],
      'body-12': ['12px', '14px'],
      'body-14': ['14px', '20px'],
      'body-16': ['16px', '22px'],
      'body-18': ['18px', '24px'],

      'h-1': ['48px', '58px'],
      'h-2': ['40px', '48px'],
      'h-3': ['32px', '40px'],
      'h-4': ['24px', '28px'],
      'h-5': ['20px', '24px'],
      'h-6': ['18px', '20px'],
    },
    screens: {
      xs: '576px',
      s: '768px',
      m: '1024px',
      l: '1440px',
      xl: '1920px',
      xxl: '2560px',
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
        13: '3.225rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.625rem',
        26: '6.5rem',
        29: '7.25rem',
        30: '7.5rem',
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
        81: '20.25rem',
        82: '20.5rem',
        86: '21.5rem',
        94: '23.5rem',
        100: '25rem',
        110: '27.5rem',
        '7px': '7px',
        '3.5px': '3.5px',
        '33px': '33px',
        '250px': '250px',
        '288px': '288px',
        '320px': '320px',
        '328px': '328px',
        '362px': '362px',
        '480px': '480px',
        '596px': '596px',
        '608px': '608px',
        '624px': '624px',
        '680px': '680px',
        '704px': '704px',
        '768px': '768px',
        '896px': '896px',
        '944px': '944px',
        '1024px': '1024px',
        '1208px': '1208px',
        '1440px': '1440px',
        '1920px': '1920px',
        '95%': '95%',
        'screen-offset-8': 'calc(100vw - 32px)',
      },
      gridTemplateColumns: {
        'category-selector-m': '28% 22% 22% 28%',
        'category-selector-l': '403px 316px 316px 403px',
        'main-m': '616px 280px',
        'main-l': '898px 280px',
      },
      colors: {
        current: 'currentColor',
        'brand-a1': '#FF9514',
        'brand-a2': '#FFEEDD',
        'brand-a3': '#FA6D20',
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
        error: '#F75555',
        'nc-success': '#0EB85E',
        'nc-additional': '#D6E3E8',
        'nc-title': '#172029',
        'nc-primary': '#FF8514',
        'nc-placeholder': '#89A3BE',
        'nc-primary-text': '#333F48',
        'nc-secondary-text': '#68757E',
        'nc-salmon': '#FFEAD7',
        'nc-accent': '#DEF0FF',
        'nc-icon': '#89A3BE',
        'nc-icon-hover': '#6C859F',
        'nc-link': '#0058A6',
        'nc-back': '#F6F8F9',
        'nc-disabled': '#ACB9C3',
        'nc-info': '#F2F6FA',
        'nc-border': '#CCDBEB',
        'sold-background': 'rgba(255,64,64, 0.2)',
        green: '#4AAF57',
        'primary-100': '#F1E7FF',
        'primary-500': '#7210FF',
        'secondary-500': '#FFD300',
        'greyscale-50': '#FAFAFA',
        'greyscale-100': '#F5F5F5',
        'greyscale-200': '#EEEEEE',
        'greyscale-300': '#E0E0E0',
        'greyscale-400': '#BDBDBD',
        'greyscale-500': '#9E9E9E',
        'greyscale-600': '#757575',
        'greyscale-700': '#616161',
        'greyscale-800': '#424242',
        'greyscale-900': '#212121',
        'gray-200': '#EAECF0',
        'gray-500': '#667085',
        'dark-1': '#181A20',
        'dark-2': '#1F222A',
        'background-orange': '#FFF8ED',
        'modal-background': 'rgba(31, 34, 42, 0.7)',
        pink: '#FFF5F5',
        purple: '#7210FF',
        'input-bg': 'rgba(114, 16, 255, 0.08)',
        yellow: '#FFFEE0',
        'dark-blue': '#B8D5FF',
        info: '#246BFD',
        blue: '#F6FAFD',
      },
      zIndex: {
        9: 9,
      },
      dropShadow: {
        card: '0 45px 80px rgba(4, 6, 15, 0.08)',
      },
      boxShadow: {
        popup: '4px 8px 24px rgba(114, 16, 255, 0.25)',
        1: '0px 4px 60px rgba(4,6,15,0.08)',
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
        '592px': '592px',
        '704px': '704px',
        '288px': '288px',
        '960px': '960px',
        '1208px': '1208px',
        screen: '100vw',
      },
      minHeight: {
        10: '2.5rem',
        20: '5rem',
        '1/2': '50vh',
        '2/3': '66vh',
        '9/10': '90vh',
        '900px': '900px',
      },
      minWidth: {
        10: '2.5rem',
        40: '10rem',
        52: '13rem',
        '288px': '288px',
      },
      outline: {
        'brand-a1': ['2px solid #FF9514', '1px'],
      },
      backgroundImage: () => ({
        'landing-head': "url('/img/landing/head-bg.png')",
        'landing-footer': "url('/img/landing/footer-bg.png')",
        'man-with-laptop': "url('/img/landing/man-with-laptop.png')",
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
      'auth-popup-arrow': {
        borderColor: theme('colors.white'),
        borderWidth: 1,
        backgroundColor: theme('colors.white'),
        size: 10,
        offset: 155,
      },
      'location-popup-arrow': {
        borderColor: theme('colors.white'),
        borderWidth: 1,
        backgroundColor: theme('colors.white'),
        size: 10,
        offset: 110,
      },
      'map-hint-arrow': {
        borderColor: theme('colors.nc-link'),
        borderWidth: 1,
        backgroundColor: theme('colors.nc-link'),
        size: 10,
        offset: 25,
      },
      'map-hint-arrow-mobile': {
        borderColor: theme('colors.nc-link'),
        borderWidth: 1,
        backgroundColor: theme('colors.nc-link'),
        size: 10,
        offset: 145,
      },
    }),
    gradientColorStops: (theme) => ({
      ...theme('colors'),
    }),
  },
  variants: {
    extend: {
      fontWeight: ['first'],
      margin: ['first', 'last'],
      padding: ['first', 'last'],
      borderRadius: ['first', 'last'],
      borderWidth: ['first', 'last'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      position: ['focus'],
      colors: ['checked', 'focused'],
      backgroundColor: ['checked'],
      borderColor: ['focus-within'],
    },
  },
  plugins: [
    capitalizeFirst,
    lineClamp,
    typography,
    tooltipArrow(),
    forms({
      strategy: 'class',
    }),
    plugin(({addVariant}) => {
      addVariant('not-last', '&:not(:last-child)')
    }),
    plugin(function ({addVariant, e, postcss}) {
      addVariant('firefox', ({container, separator}) => {
        const isFirefoxRule = postcss.atRule({
          name: '-moz-document',
          params: 'url-prefix()',
        })
        isFirefoxRule.append(container.nodes)
        container.append(isFirefoxRule)
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`,
          )}`
        })
      })
    }),
    plugin(({addBase, theme}) => {
      addBase({
        '.scrollbar': {
          scrollbarColor: `${theme('colors.greyscale-300')} ${theme(
            'colors.white',
          )}`,
          scrollbarWidth: 'thin',
        },
        '.scrollbar::-webkit-scrollbar': {
          height: '2px',
          width: '4px',
        },
        '.scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: theme('colors.purple'),
          borderRadius: '100vh',
        },
        '.scrollbar::-webkit-scrollbar-track-piece': {
          backgroundColor: theme('colors.white'),
        },
      })
    }),
  ],
}
