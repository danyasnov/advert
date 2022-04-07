import type {NextApiRequest, NextApiResponse} from 'next'
import {checkExisting} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return checkExisting({email: body.email, phone: body.phone}, storage).then(
    (result) => {
      return res.json(result)
    },
  )
}
