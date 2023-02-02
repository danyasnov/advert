import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {fetchDrafts} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {limit, page, cacheId} = body
  const storage = getStorageFromCookies({req, res})

  return fetchDrafts({limit, page, cacheId}, storage).then((result) => {
    return res.json(result)
  })
}
