import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchProducts} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {filter, page, advHash, limit, cacheId} = body
  const state = await processCookies({req})

  return fetchProducts(state, {filter, page, advHash, limit, cacheId})
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
