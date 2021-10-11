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
const locales = ['en', 'el', 'ro', 'ru', 'tr', 'uk']
const domains = {
  dev: 'localhost:3000',
  prod: 'adverto.sale',
  stage: 'fpreprod.adverto.sale',
}

const getDomain = (host) => {
  if (host.includes('localhost')) {
    return domains.dev
  }
  if (host.includes('fpreprod')) {
    return domains.stage
  }
  if (host.includes('adverto')) {
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

    // first visit
    if (!cookies.language) {
      let language

      const subDomainLang = locales.find((l) => pathname.startsWith(l))
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
      !host.startsWith('fpreprod') &&
      !host.startsWith('adverto')
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
