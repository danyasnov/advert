import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchCurrenciesByGPS} from '../../api/v1'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})
  return fetchCurrenciesByGPS(body.location, state.language).then(
    (response) => {
      res.json(response)
    },
  )
}
