import type {NextApiRequest, NextApiResponse} from 'next'
import {remindPassword} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return remindPassword(body.email).then((result) => {
    return res.json(result)
  })
}
