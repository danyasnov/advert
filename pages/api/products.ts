import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchProducts} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  return fetchProducts(state, body.data, body.pagination)
    .then((response) => {
      res.json(response.data)
    })
    .catch((e) => {
      res.json(e)
    })
}
