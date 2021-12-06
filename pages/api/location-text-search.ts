import type {NextApiRequest, NextApiResponse} from 'next'
import {makeRequest} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {query} = req
  return makeRequest({
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    params: {
      key: process.env.GOOGLE_API,
      input: query.query,
      language: 'ru',
    },
  }).then(({data}) => {
    res.json(data)
  })
}
