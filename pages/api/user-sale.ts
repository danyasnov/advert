import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {fetchUserSale} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {userId, page, cacheId} = body
  const storage = await getStorageFromCookies({req, res})

  return fetchUserSale({userId, page, cacheId}, storage)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
