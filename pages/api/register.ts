import type {NextApiRequest, NextApiResponse} from 'next'
import {register} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return register(body.credentials, body.params, storage).then((result) => {
    return res.json(result)
  })
}
