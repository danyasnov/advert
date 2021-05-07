const {i18n} = require('./next-i18next.config')

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  future: {
    webpack5: true,
  },
  i18n,
}
