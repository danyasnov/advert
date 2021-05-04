const https = require('https') // or 'https' for https:// URLs
const fs = require('fs')

const token = 'proj_pub_InQLPlQ9dTs6LjID1IbA8Q'
const getUrl = ({id, locale}) => {
  return `https://webtranslateit.com/api/projects/${token}/files/${id}/locales/${locale}`
}
const locales = [
  {id: 848359, locale: 'en'},
  {id: 848364, locale: 'el'},
  {id: 848366, locale: 'ro'},
  {id: 848360, locale: 'ru'},
  {id: 848365, locale: 'tr'},
  {id: 848367, locale: 'uk'},
]
locales.forEach((localeData) => {
  https.get(getUrl(localeData), (res) => {
    let body = ''

    res.on('data', (chunk) => {
      body += chunk
    })

    res.on('end', () => {
      fs.writeFileSync(`locales/${localeData.locale}/common.json`, body)
    })
  })
})
