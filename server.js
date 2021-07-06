// server.js
const {parseCookies, setCookie} = require('nookies')
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
  stage: 'fpreprod.adverto.sale',
}

const getDomain = (host) => {
  if (host.includes('localhost')) {
    return domains.dev
  }
  if (host.includes('fpreprod')) {
    return domains.stage
  }
  return host
}

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    const {host} = req.headers
    const cookies = parseCookies({req})
    const languages = parser.parse(req.headers['accept-language'])
    const parsedUrl = parse(req.url, true)
    const {pathname, query} = parsedUrl
    req.originalUrl = pathname

    // first visit
    if (!cookies.language) {
      let language

      // eslint-disable-next-line no-restricted-syntax
      for (const browserLang of languages) {
        if (locales.includes(browserLang.code)) {
          language = browserLang.code
          break
        }
      }
      if (language && language !== 'en') {
        setCookie({res}, 'language', language)
        req.locale = language

        if (!host.startsWith(language)) {
          res.redirect(`http://${language}.${getDomain(host)}${pathname}`)
          return res.end()
        }
      } else {
        language = 'en'
        setCookie({res}, 'language', language)
        req.locale = language
        if (!host.startsWith(getDomain(host))) {
          res.redirect(`http://${getDomain(host)}${pathname}`)
          return res.end()
        }
      }
    } else if (
      cookies.language !== 'en' &&
      !host.startsWith(cookies.language)
    ) {
      res.redirect(`http://${cookies.language}.${getDomain(host)}${pathname}`)
      return res.end()
    } else if (
      cookies.language === 'en' &&
      !host.startsWith('localhost') &&
      !host.startsWith('fpreprod')
    ) {
      res.redirect(`http://${getDomain(host)}${pathname}`)
      return res.end()
    }
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
