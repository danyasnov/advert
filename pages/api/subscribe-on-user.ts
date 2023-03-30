import type {NextApiRequest, NextApiResponse} from 'next'
import {subscribeOnUser} from '../../api/v1'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {userId, isAlreadySubscribed} = body
  const storage = getStorageFromCookies({req, res})

  return subscribeOnUser(storage, userId, isAlreadySubscribed)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
