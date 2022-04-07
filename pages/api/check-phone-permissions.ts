import type {NextApiRequest, NextApiResponse} from 'next'
import {parseIp} from '../../api'
import {checkPhonePermissions} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const {hash} = body
  const ip = parseIp(req)
  const storage = getStorageFromCookies({req, res})
  return checkPhonePermissions(hash, ip, storage).then((response) => {
    return res.json(response)
  })
}
