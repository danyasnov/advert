import type {NextApiRequest, NextApiResponse} from 'next'
import {Storage} from '../../stores/Storage'
import {getRest} from '../../api'
import {parseCookies} from '../../helpers'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const cookies = parseCookies(req)
  const storage = new Storage({language: cookies.language})
  const rest = getRest(storage)
  return rest.geo.fetchRegionByCountry(body.country).then((response) => {
    res.json(response)
  })
}
