import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchLanguages} from '../../api/v1'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const cookies = parseCookies({req})
  return fetchLanguages(cookies.language).then((response) => {
    res.json(response)
  })
}
