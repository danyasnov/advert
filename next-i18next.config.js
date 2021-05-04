const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'el', 'ro', 'ru', 'tr', 'uk', 'cimode'],
    localePath: path.resolve('./locales'),
    fallbackLng: 'en',
  },
}
