const path = require('path')

const locales = ['en', 'el', 'ro', 'ru', 'tr', 'uk']
const getDomains = (domain) => {
  const result = []
  locales.forEach((l) => {
    if (l === 'en') {
      result.push({domain, defaultLocale: l})
    } else {
      result.push({domain: `${l}.${domain}`, defaultLocale: l, http: true})
    }
  })
  return result
}

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales,
    fallbackLng: 'en',
    // domains: [...getDomains('localhost:3000')],
    domains: [...getDomains('fpreprod.adverto.sale')],
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
