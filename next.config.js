const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(
  [
    'front-api',
    'front-api/node_modules/axios-curlirize',
    'react-cssfx-loading',
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
    domains: ['cache.adverto.sale', 'adverto.sale', 'cache.advretoapi.com'],
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
        source: '/api/upload/:type',
        destination: 'https://backend.advretoapi.com/files/:type/upload',
        // destination: 'https://api.adverto.sale/files/:type/upload',
      },
      {
        source: '/api/chat',
        // destination: 'https://backend.advretoapi.com:3001',
        destination: 'https://chat.adverto.sale',
      },
    ]
  },
}

module.exports = withPlugins(
  [withTM, withBundleAnalyzer, [withSentryConfig, {silent: true}]],
  nextConfig,
)
