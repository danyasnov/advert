const fs = require('fs')
const axios = require('axios')

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

const fetchTranslations = async () => {
  const enRes = await axios.get(getUrl({id: 848359, locale: 'en'}))
  const en = Object.fromEntries(
    Object.entries(enRes.data).map(([key, val]) =>
      val === null ? [key, key] : [key, val],
    ),
  )
  fs.writeFileSync(`locales/en/common.json`, JSON.stringify(en, null, 2))

  // eslint-disable-next-line no-restricted-syntax
  for (const localeData of locales) {
    // eslint-disable-next-line no-await-in-loop
    const currentLocaleRes = await axios.get(getUrl(localeData))
    const formatted = Object.fromEntries(
      Object.entries(currentLocaleRes.data).map(([key, val]) =>
        val === null ? [key, en[key] ? en[key] : key] : [key, val],
      ),
    )
    fs.writeFileSync(
      `locales/${localeData.locale}/common.json`,
      JSON.stringify(formatted, null, 2),
    )
  }
}

fetchTranslations()
