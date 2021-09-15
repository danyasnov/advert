import type {NextApiRequest, NextApiResponse} from 'next'
import {activateWithCode, authWithCode} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return activateWithCode(body.code, body.checkId).then((result) => {
    return res.json(result)
  })
}
