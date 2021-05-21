const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['front-api'], {
  resolveSymlinks: false,
})
const {i18n} = require('./next-i18next.config')

const nextConfig = {
  future: {
    webpack5: true,
  },
  images: {
    domains: ['cache.adverto.sale', 'adverto.sale'],
  },
  i18n,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
            replaceAttrValues: {
              '#7C7E83': '{props.fill}',
            },
          },
        },
      ],
    })

    return config
  },
}

module.exports = withPlugins([withTM], nextConfig)
