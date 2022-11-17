const path = require('path')

const locales = ['en', 'el', 'ru', 'uk']
const getDomains = (domains = []) => {
  const result = []
  domains.forEach((domain) => {
    locales.forEach((l) => {
      if (l === 'en') {
        result.push({domain, defaultLocale: l})
      } else {
        result.push({domain: `${l}.${domain}`, defaultLocale: l})
      }
    })
  })

  return result
}

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales,
    serializeConfig: false,
    fallbackLng: 'en',
    domains: [...getDomains(['vooxee.venera.city', 'vooxee.com'])],
  },
  localePath: path.resolve('./locales'),
}
