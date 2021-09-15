import type {NextApiRequest, NextApiResponse} from 'next'
import {sendCode} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return sendCode(body.type, body.incoming).then((result) => {
    return res.json(result)
  })
}
