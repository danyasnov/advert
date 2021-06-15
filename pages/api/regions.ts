import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {getRegions} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const cookies = parseCookies({req})
  return getRegions(body.country, cookies.language).then((response) => {
    res.json(response)
  })
}
