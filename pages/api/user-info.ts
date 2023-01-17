import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchUser} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {hash} = body
  const storage = await getStorageFromCookies({req, res})

  return fetchUser(hash, storage)
    .then((response) => {
      res.json(response)
      if (response.status === 401) {
        res.redirect('/login')
      }
    })
    .catch((e) => {
      res.json(e)
    })
}
