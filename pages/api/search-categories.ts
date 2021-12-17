import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchCategorySuggestion} from '../../api/v1'
import {SerializedCookiesState} from '../../types'
import {getQueryValue} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {query} = req
  const cookies: SerializedCookiesState = parseCookies({req})
  const {language} = cookies
  const searchData = getQueryValue(query, 'search')
  return fetchCategorySuggestion(searchData, language).then((result) => {
    // @ts-ignore
    res.json(result[0].result.slice(0, 5))
  })
}
