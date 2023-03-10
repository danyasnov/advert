import type {NextApiRequest, NextApiResponse} from 'next'
import {remindPasswordConfirm} from '../../api/v2'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return remindPasswordConfirm(body.password, body.token).then((result) => {
    return res.json(result)
  })
}
