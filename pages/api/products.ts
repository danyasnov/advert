import type {NextApiRequest, NextApiResponse} from 'next'
import {
  getQueryValue,
  getStorageFromCookies,
  processCookies,
  withLocationQuery,
} from '../../helpers'
import {fetchProducts} from '../../api/v2'
import {fetchCountries} from '../../api/v1'
import {fetchCityOrRegionsBySlug} from '../../api/db'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {filter, page, advHash, limit, cacheId, query} = body
  let state = await processCookies({req})
  if (query) {
    const countryCode = getQueryValue(query, 'country')
    const cityCode = getQueryValue(query, 'city')
    const countries = (await fetchCountries(state.language)) ?? null
    const locations = await fetchCityOrRegionsBySlug(
      countryCode,
      cityCode,
      state.language,
    )

    state = await withLocationQuery(state, query, {countries, locations})
  }

  const storage = getStorageFromCookies({res, req})

  return fetchProducts(state, {filter, page, advHash, limit, cacheId}, storage)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
