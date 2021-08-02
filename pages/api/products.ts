import type {NextApiRequest, NextApiResponse} from 'next'
import {getQueryValue, processCookies, withLocationQuery} from '../../helpers'
import {fetchProducts} from '../../api/v2'
import {fetchCountries} from '../../api/v1'
import {fetchCitiesByCountryCode, fetchRegionsByCountryCode} from '../../api/db'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {filter, page, advHash, limit, cacheId, query} = body
  let state = await processCookies({req})
  if (query) {
    const countryCode = getQueryValue(query, 'country')
    const countries = (await fetchCountries(state.language)) ?? null
    const cities = await fetchCitiesByCountryCode(countryCode, state.language)
    const regions = await fetchRegionsByCountryCode(countryCode, state.language)
    state = await withLocationQuery(state, query, {countries, cities, regions})
  }

  return fetchProducts(state, {filter, page, advHash, limit, cacheId})
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
