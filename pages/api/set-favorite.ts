import type {NextApiRequest, NextApiResponse} from 'next'
import {toggleFavorite} from '../../api/v1'
import {getStorageFromCookies, processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return toggleFavorite(body.hash, body.operation, storage).then((result) => {
    return res.json(result)
  })
}
