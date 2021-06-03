import type {NextApiRequest, NextApiResponse} from 'next'
import {getLocationByIp, parseIp} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {query} = req
  const ip = query.ip || parseIp(req)
  return getLocationByIp(ip).then(({data}) => {
    res.json(data)
  })
}
