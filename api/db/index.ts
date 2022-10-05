import {QueryTypes, Sequelize} from 'sequelize'
import {size} from 'lodash'
import {captureException} from '@sentry/nextjs'
import {City} from '../../types'
import config from '../../config.json'

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
  },
)
const langs = {
  en: 2,
  ru: 1,
  el: 25,
  uk: 67,
}
const cache = new Map()

export const fetchCitiesByCountryCode = async (
  code: string,
  lang: string,
): Promise<City[]> => {
  const key = `cities-${code}-${lang}`
  const cached: City[] = cache.get(key)
  if (cached) return cached
  try {
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
  } catch (e) {
    captureException(e)
    return []
  }
}

export const fetchRegionsByCountryCode = async (
  code: string,
  lang: string,
): Promise<City[]> => {
  const key = `regions-${code}-${lang}`
  const cached: City[] = cache.get(key)
  if (cached) return cached
  try {
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
  } catch (e) {
    captureException(e)
    return []
  }
}
export const fetchCityOrRegionsBySlug = async (
  country: string,
  slug: string,
  lang: string,
): Promise<City[]> => {
  try {
    const result: City[] = await sequelize.query(
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
    return result
  } catch (e) {
    captureException(e)
    return []
  }
}

export const fetchDocuments = async (path: string, lang = 'en') => {
  const key = `docs-${path}-${lang}`
  const cached = cache.get(key)
  if (cached) return cached
  try {
    const result = await sequelize.query(
      `SELECT * FROM adv_site_content_new WHERE id_lang=${
        langs[lang] || 2
      } AND url='/${path}/'`,
      {type: QueryTypes.SELECT},
    )
    if (size(result)) {
      cache.set(key, result)
    } else if (langs[lang] !== 2) {
      return fetchDocuments(path, 'en')
    }
    return result
  } catch (e) {
    captureException(e)
    return []
  }
}

export const fetchFirebaseLink = async (hash: string) => {
  try {
    const result = await sequelize.query(
      `SELECT hash_link, firebase_link, date_off FROM adv_cover_links WHERE hash_link='${hash}'`,
      {type: QueryTypes.SELECT},
    )
    return result
  } catch (e) {
    captureException(e)
    return []
  }
}

export const incrementDeeplinkCounter = async (hash: string) => {
  try {
    return await sequelize.query(
      `UPDATE adv_cover_links SET count_view=count_view+1, time_view=${Math.floor(
        new Date().getTime() / 1000,
      )} WHERE hash_link='${hash}'`,
      {type: QueryTypes.UPDATE},
    )
  } catch (e) {
    captureException(e)
  }
}
export const addMetaToDeeplink = async (
  hash: string,
  ip: string,
  referrer: string,
  userAgent: string,
) => {
  try {
    return await sequelize.query(
      `INSERT INTO adv_cover_links_log VALUES ('${hash}', ${Math.floor(
        new Date().getTime() / 1000,
      )}, '${ip}', '${referrer}', '${userAgent}')`,
      {type: QueryTypes.INSERT},
    )
  } catch (e) {
    captureException(e)
  }
}

export const fetchUser = async (
  hash: string,
): Promise<{hash: string; lang: number}[]> => {
  try {
    return await sequelize.query(
      `SELECT hash, email, name, surname, lang FROM adv_users WHERE hash='${hash}'`,
      {type: QueryTypes.SELECT},
    )
  } catch (e) {
    captureException(e)
    return []
  }
}
export const setUserPass = async (hash: string, pass: string) => {
  try {
    return await sequelize.query(
      `UPDATE adv_users SET email_pass='${pass}' WHERE hash='${hash}'`,
      {type: QueryTypes.SELECT},
    )
  } catch (e) {
    captureException(e)
  }
}
