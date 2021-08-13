const https = require('https') // or 'https' for https:// URLs
const fs = require('fs')

const token = 'proj_pub_InQLPlQ9dTs6LjID1IbA8Q'
const getUrl = ({id, locale}) => {
  return `https://webtranslateit.com/api/projects/${token}/files/${id}/locales/${locale}`
}
const locales = [
  // {id: 848359, locale: 'en'},
  {id: 848364, locale: 'el'},
  {id: 848366, locale: 'ro'},
  {id: 848360, locale: 'ru'},
  {id: 848365, locale: 'tr'},
  {id: 848367, locale: 'uk'},
]

https.get(getUrl({id: 848359, locale: 'en'}), (resEn) => {
  let bodyEn = ''

  resEn.on('data', (chunk) => {
    bodyEn += chunk
  })

  resEn.on('end', () => {
    const en = Object.fromEntries(
      Object.entries(JSON.parse(bodyEn)).map(([key, val]) =>
        val === null ? [key, key] : [key, val],
      ),
    )
    fs.writeFileSync(`locales/en/common.json`, JSON.stringify(en, null, 2))
    locales.forEach((localeData) => {
      https.get(getUrl(localeData), (res) => {
        let body = ''

        res.on('data', (chunk) => {
          body += chunk
        })

        res.on('end', () => {
          const formatted = Object.fromEntries(
            Object.entries(JSON.parse(body)).map(([key, val]) =>
              val === null ? [key, en[key] ? en[key] : key] : [key, val],
            ),
          )
          fs.writeFileSync(
            `locales/${localeData.locale}/common.json`,
            JSON.stringify(formatted, null, 2),
          )
        })
      })
    })
  })
})
