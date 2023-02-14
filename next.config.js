const withTM = require('next-transpile-modules')(
  [
    'front-api',
    'front-api/node_modules/axios-curlirize',
    'react-cssfx-loading',
    'chats',
    // 'chats/node_modules/front-api',
  ],
  {
    resolveSymlinks: false,
  },
)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const {withSentryConfig} = require('@sentry/nextjs')

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'cache.venera.city',
      'vooxee.com',
      'cache.vooxee.com',
      'vooxee.venera.city',
      'ao-dev.venera.city',
    ],
  },
  publicRuntimeConfig: {
    domain: process.env.DOMAIN,
  },
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
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/chats',
        destination: 'https://ao-dev.venera.city:5002/ws',
      },
      {
        source: '/upload/:type',
        destination: 'https://backend.venera.city/files/:type/upload',
        // destination: 'https://backend.vooxee.com/files/:type/upload',
        // destination: 'https://api.adverto.sale/files/:type/upload',
      },
    ]
  },
}
const plugins = [withTM, withBundleAnalyzer, withSentryConfig]

module.exports = plugins.reduce((acc, next) => next(acc), nextConfig)
