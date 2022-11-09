const {Sequelize, QueryTypes} = require('sequelize')
const {captureException} = require('@sentry/nextjs')
const config = require('./config.json')
const {City} = require('./types')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
  },
)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })

const fetchCityOrRegionsBySlug = async (country, slug, lang) => {
  try {
    const result = await sequelize.query(
      `SELECT
    l.id,
    IFNULL(lt.content, l.word) as word,
    IFNULL(ha.has_adverts, false) as has_adverts,
    l.slug,
    l.type
FROM adv_locations l
         LEFT JOIN \`adv_location_translations\` lt ON lt.object_id = l.id AND lt.field = 'word' AND lt.locale = '${lang}'
         LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
         LEFT JOIN adv_countries ac on ac.id_location = l.root_id
WHERE (l.type = 'region' OR l.type = 'city') AND l.slug = '${slug}' AND ac.alpha2 = '${country}'
ORDER BY word`,
      {type: QueryTypes.SELECT},
    )
    console.log(result)
    return result
  } catch (e) {
    console.error(e)
    captureException(e)
    return []
  }
}
fetchCityOrRegionsBySlug('CY', 'limassol', 'ru').then((res) => {
  console.log(res)
})
