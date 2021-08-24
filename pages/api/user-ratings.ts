import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchUserRatings} from '../../api/v1'
import {processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {userId} = body
  const state = await processCookies({req})

  return fetchUserRatings(userId, state.language)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
