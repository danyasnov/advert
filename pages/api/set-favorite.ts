import type {NextApiRequest, NextApiResponse} from 'next'
import {toggleFavorite} from '../../api/v1'
import {processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  return toggleFavorite(
    body.hash,
    body.operation,
    state.token,
    state.hash,
  ).then((result) => {
    return res.json(result)
  })
}
