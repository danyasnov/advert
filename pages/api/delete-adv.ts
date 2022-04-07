import type {NextApiRequest, NextApiResponse} from 'next'
import {deleteAdv} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return deleteAdv(body.hash, storage).then((result) => {
    return res.json(result)
  })
}
