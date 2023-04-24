import type {NextApiRequest, NextApiResponse} from 'next'
import {refreshAdvert} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return refreshAdvert(body.hash, storage).then((response) => {
    res.json(response)
  })
}
