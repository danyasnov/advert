import type {NextApiRequest, NextApiResponse} from 'next'
import {resetPassword} from '../../api/v2'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return resetPassword(body.email).then((result) => {
    return res.json(result)
  })
}
