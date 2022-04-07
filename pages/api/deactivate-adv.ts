import type {NextApiRequest, NextApiResponse} from 'next'
import {deactivateAdv} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return deactivateAdv(body.hash, body.soldMode, storage).then((result) => {
    return res.json(result)
  })
}
