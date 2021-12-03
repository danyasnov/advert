import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchUser} from '../../api/v1'
import {processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {hash} = body
  const state = await processCookies({req})

  return fetchUser(hash, state.language, state.token)
    .then((response) => {
      res.json(response)
    })
    .catch((e) => {
      res.json(e)
    })
}
