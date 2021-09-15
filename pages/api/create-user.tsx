import type {NextApiRequest, NextApiResponse} from 'next'
import {createUser} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return createUser(body).then((result) => {
    return res.json(result)
  })
}
