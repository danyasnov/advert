import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {getCities} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const cookies = parseCookies({req})
  return getCities(body.region, cookies.language).then((response) => {
    res.json(response)
  })
}
