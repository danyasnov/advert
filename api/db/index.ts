import {QueryTypes, Sequelize} from 'sequelize'
import {City} from '../../types'

const sequelize = new Sequelize(
  'advretoapi_db1',
  'advretoapi_usr',
  'o~6?!5drsp)+',
  {
    host: '23.106.61.67',
    dialect: 'mysql',
  },
)

const cache = new Map()

export const fetchCitiesByCountryCode = async (
  code: string,
  lang: string,
): Promise<City[]> => {
  const key = `cities-${code}-${lang}`
  const cached: City[] = cache.get(key)
  if (cached) return cached
  const result: City[] = await sequelize.query(
    `SELECT
    l.id,
    IFNULL(lt.content, l.word) as word,
    IFNULL(ha.has_adverts, false) as has_adverts,
    l.slug
FROM adv_locations l
         LEFT JOIN \`adv_location_translations\` lt ON lt.object_id = l.id AND lt.field = 'word' AND lt.locale = '${lang}'
         LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
         LEFT JOIN adv_countries ac on ac.id_location = l.root_id
WHERE l.type = 'city' AND ac.alpha2 = '${code}'
ORDER BY word`,
    {type: QueryTypes.SELECT},
  )
  cache.set(key, result)
  return result
}

export const fetchRegionsByCountryCode = async (
  code: string,
  lang: string,
): Promise<City[]> => {
  const key = `regions-${code}-${lang}`
  const cached: City[] = cache.get(key)
  if (cached) return cached
  const result: City[] = await sequelize.query(
    `SELECT
    l.id,
    IFNULL(lt.content, l.word) as word,
    IFNULL(ha.has_adverts, false) as has_adverts,
    l.slug
FROM adv_locations l
         LEFT JOIN \`adv_location_translations\` lt ON lt.object_id = l.id AND lt.field = 'word' AND lt.locale = '${lang}'
         LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
         LEFT JOIN adv_countries ac on ac.id_location = l.root_id
WHERE l.type = 'region' AND ac.alpha2 = '${code}'
ORDER BY word`,
    {type: QueryTypes.SELECT},
  )
  cache.set(key, result)
  return result
}
export const fetchCityOrRegionsBySlug = async (
  country: string,
  slug: string,
  lang: string,
): Promise<City[]> => {
  return sequelize.query(
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
}
//
// 1-ru 2-en
export const fetchDocuments = async (path: string) => {
  const key = `docs-${path}`
  const cached = cache.get(key)
  if (cached) return cached
  const result = await sequelize.query(
    `SELECT * FROM adv_site_content WHERE id_lang=2 AND url='/${path}/'`,
    {type: QueryTypes.SELECT},
  )
  cache.set(key, result)
  return result
}
