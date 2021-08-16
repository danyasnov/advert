const path = require('path')

const locales = ['en', 'el', 'ro', 'ru', 'tr', 'uk']
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
    domains: [...getDomains(['adverto.sale', 'fpreprod.adverto.sale'])],
  },
  localePath: path.resolve('./locales'),
}

// [
// ({domain: 'sample.com', defaultLocale: 'en'},
//   {domain: 'el.sample.com', defaultLocale: 'el'},
//   {domain: 'ro.sample.com', defaultLocale: 'ro'},
//   {domain: 'ru.sample.com', defaultLocale: 'ru'},
//   {domain: 'tr.sample.com', defaultLocale: 'tr'},
//   {domain: 'uk.sample.com', defaultLocale: 'uk'})
// ]
