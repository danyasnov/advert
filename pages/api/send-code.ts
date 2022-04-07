import type {NextApiRequest, NextApiResponse} from 'next'
import {sendCode} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return sendCode(body.incoming, body.verifyMode, storage).then((result) => {
    return res.json(result)
  })
}
