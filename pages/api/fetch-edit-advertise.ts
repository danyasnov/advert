import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {fetchEditAdvertise} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return fetchEditAdvertise(storage, body.hash).then((result) => {
    return res.json(result)
  })
}
