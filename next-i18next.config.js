const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'el', 'ro', 'ru', 'tr', 'uk'],
    fallbackLng: 'en',
    domains: [
      {
        domain: 'localhost',
        defaultLocale: 'ru',
      },
      {
        domain: 'adverto.sale',
        defaultLocale: 'en',
      },
      {
        domain: 'el.adverto.sale',
        defaultLocale: 'el',
      },
      {
        domain: 'ro.adverto.sale',
        defaultLocale: 'ro',
      },
      {
        domain: 'tr.adverto.sale',
        defaultLocale: 'tr',
      },
      {
        domain: 'uk.adverto.sale',
        defaultLocale: 'uk',
      },
    ],
  },
  localePath: path.resolve('./locales'),
}
