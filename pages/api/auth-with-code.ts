import type {NextApiRequest, NextApiResponse} from 'next'
import {authWithCode} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return authWithCode(body.phone, body.code).then((result) => {
    return res.json(result)
  })
}
