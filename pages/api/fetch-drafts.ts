import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchDrafts} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  return fetchDrafts(state).then((result) => {
    return res.json(result)
  })
}
