import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {fetchDrafts} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const storage = getStorageFromCookies({req, res})

  return fetchDrafts(storage).then((result) => {
    return res.json(result)
  })
}
