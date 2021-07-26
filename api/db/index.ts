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

// eslint-disable-next-line import/prefer-default-export
export const fetchCitiesByCountryCode = (
  code: string,
  lang: string,
): Promise<City[]> => {
  return sequelize.query(
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
}
