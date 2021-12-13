import type {NextApiRequest, NextApiResponse} from 'next'
import {makeRequest} from '../../api'

export default (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> | void => {
  const {body} = req
  const {location} = body
  if (!location) {
    return res.json({error: 'no location'})
  }
  const {longitude, latitude} = location
  const base = 'https://maps.googleapis.com/maps/api'
  return makeRequest({
    method: 'get',
    url: `${base}/geocode/json`,
    params: {
      key: process.env.GOOGLE_API,
      latlng: `${latitude},${longitude}`,
      language: 'ru',
    },
  }).then(({data}) => {
    res.json(data)
  })
}
