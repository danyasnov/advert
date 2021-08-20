import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchUserSale} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {userId, page, cacheId} = body
  const state = await processCookies({req})
  return fetchUserSale({userId, page, cacheId}, state.language)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
