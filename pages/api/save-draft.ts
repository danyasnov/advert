import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {saveDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {draft, hash} = body
  const state = await processCookies({req})

  return saveDraft(state, draft, hash).then((result) => {
    return res.json(result)
  })
}
