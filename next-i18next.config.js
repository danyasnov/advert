const path = require('path')

const locales = ['en', 'el', 'ro', 'ru', 'tr', 'uk']
const getDomains = (domain) => {
  const result = []
  locales.forEach((l) => {
    if (l === 'en') {
      result.push({domain, defaultLocale: l})
    } else {
      result.push({domain: `${l}.${domain}`, defaultLocale: l})
    }
  })
  return result
}

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales,
    fallbackLng: 'en',
    domains: [
      {
        domain: 'localhost',
        defaultLocale: 'ru',
      },
      ...getDomains('adverto.sale'),
      ...getDomains('fpreprod.adverto.sale'),
    ],
  },
  localePath: path.resolve('./locales'),
}
