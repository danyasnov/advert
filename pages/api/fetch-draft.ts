import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {fetchDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {hash} = body
  const storage = getStorageFromCookies({req, res})

  return fetchDraft(hash, storage).then((result) => {
    return res.json(result)
  })
}
