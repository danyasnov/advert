// server.js
const {parseCookies} = require('nookies')
const parser = require('accept-language-parser')
const express = require('express')
const {parse} = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()
const locales = ['en', 'el', 'ru', 'uk']
const domains = {
  dev: 'localhost:3000',
  prod: 'vooxee.com',
  stage: 'vooxee.venera.city',
}
const whitelist = [
  '/b/',
  '/_next',
  '/api',
  '/favicon-32x32.png',
  '/site.webmanifest',
]

const getDomain = (host) => {
  if (host.includes('localhost')) {
    return domains.dev
  }
  if (host.includes('vooxee.venera.city')) {
    return domains.stage
  }
  if (host.includes('vooxee.com')) {
    return domains.prod
  }
  return host
}

const getProtocol = (host) => {
  if (host.includes('localhost')) {
    return 'http'
  }
  return 'https'
}

app.prepare().then(() => {
  const server = express()
  server.all('*', (req, res) => {
    const {host} = req.headers
    const cookies = parseCookies({req})
    const languages = parser.parse(req.headers['accept-language'])
    const parsedUrl = parse(req.url, true)
    const {pathname} = parsedUrl

    // if deeplink - no need to redirect or set cookies
    if (whitelist.findIndex((string) => pathname.startsWith(string)) !== -1) {
      return handle(req, res)
    }
    console.warn(['pathname', pathname])

    // first visit
    if (!cookies.language) {
      let language

      const subDomainLang = locales.find((l) => host.startsWith(l))
      // const subDomainLang = null
      if (subDomainLang) {
        language = subDomainLang
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const browserLang of languages) {
          if (locales.includes(browserLang.code)) {
            language = browserLang.code
            break
          }
        }
      }

      if (language && language !== 'en') {
        req.locale = language

        if (!host.startsWith(language)) {
          res.redirect(
            `${getProtocol(host)}://${language}.${getDomain(host)}${pathname}`,
          )
          return res.end()
        }
      } else {
        language = 'en'
        req.locale = language
        if (!host.startsWith(getDomain(host))) {
          res.redirect(`${getProtocol(host)}://${getDomain(host)}${pathname}`)
          return res.end()
        }
      }
    } else if (
      cookies.language !== 'en' &&
      !host.startsWith(cookies.language)
    ) {
      res.redirect(
        `${getProtocol(host)}://${cookies.language}.${getDomain(
          host,
        )}${pathname}`,
      )
      return res.end()
    } else if (
      cookies.language === 'en' &&
      !host.startsWith('localhost') &&
      !host.startsWith('vooxee')
    ) {
      res.redirect(`${getProtocol(host)}://${getDomain(host)}${pathname}`)
      return res.end()
    }
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
