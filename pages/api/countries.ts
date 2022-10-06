import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchCountries} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const cookies = parseCookies({req})
  return fetchCountries(cookies.language).then((response) => {
    res.json(response)
  })
}
