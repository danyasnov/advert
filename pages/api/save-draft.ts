import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {saveDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {draft, hash} = body
  const storage = getStorageFromCookies({req, res})

  return saveDraft(storage, draft, hash).then((result) => {
    return res.json(result)
  })
}
