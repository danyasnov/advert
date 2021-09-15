import type {NextApiRequest, NextApiResponse} from 'next'
import {checkPhoneNumber} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return checkPhoneNumber(body.type, body.incoming).then((result) => {
    return res.json(result)
  })
}
