import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {restUpdateLanguages} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const {main, additional} = body
  const storage = getStorageFromCookies({req, res})

  return restUpdateLanguages(storage, main, additional).then((result) => {
    return res.json(result)
  })
}
