import type {NextApiRequest, NextApiResponse} from 'next'
import {changeContact} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return changeContact(
    body.verifyMode,
    body.code,
    body.incoming,
    storage,
    body.conflictsResolving,
  ).then((result) => {
    return res.json(result)
  })
}
