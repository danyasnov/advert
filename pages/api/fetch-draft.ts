import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {hash} = body
  const state = await processCookies({req})

  return fetchDraft(state, hash).then((result) => {
    return res.json(result)
  })
}
