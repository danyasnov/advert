import type {NextApiRequest, NextApiResponse} from 'next'
import {globalRestApi} from '../index'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const {body} = req
  globalRestApi.geo.fetchRegionByCountry(body.country).then((response) => {
    res.json(response)
  })
}
