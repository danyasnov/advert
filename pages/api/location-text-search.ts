import type {NextApiRequest, NextApiResponse} from 'next'
import {makeRequest} from '../../api'
import {processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {query} = req
  const state = await processCookies({req})

  return makeRequest({
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    params: {
      key: process.env.GOOGLE_API,
      input: query.query,
      language: state.language,
    },
  }).then(({data}) => {
    res.json(data)
  })
}
