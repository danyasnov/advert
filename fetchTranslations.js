const fs = require('fs')
const axios = require('axios')

const token = 'proj_pub_57QWstid1FDB-Z9-pwExRw'
const getUrl = ({id, locale}) => {
  return `https://webtranslateit.com/api/projects/${token}/files/${id}/locales/${locale}`
}
const locales = [
  {id: 923219, locale: 'el'},
  {id: 923220, locale: 'ru'},
  {id: 923221, locale: 'uk'},
]

const fetchTranslations = async () => {
  let enRes
  try {
    enRes = await axios.get(getUrl({id: 923218, locale: 'en'}))
  } catch (e) {
    console.error(e.message)
    throw e.message
  }
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
