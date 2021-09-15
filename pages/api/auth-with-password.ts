import type {NextApiRequest, NextApiResponse} from 'next'
import {authWithPassword} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return authWithPassword(body.incoming, body.password).then((result) => {
    return res.json(result)
  })
}
