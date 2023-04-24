import type {NextApiRequest, NextApiResponse} from 'next'
import {subscribersSubscriptions} from '../../api/v1'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {hash, type, page} = body
  const storage = getStorageFromCookies({req, res})

  return subscribersSubscriptions(storage, hash, type, page)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
