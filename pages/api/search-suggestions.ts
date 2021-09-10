import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchCategorySuggestion, fetchSearchSuggestion} from '../../api/v1'
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
  const promises = [
    fetchCategorySuggestion(searchData, language),
    fetchSearchSuggestion(searchData, language),
  ]
  return Promise.all(promises).then((result) => {
    // @ts-ignore
    res.json([
      ...result[0].result.slice(0, 5),
      ...result[1].data.data.slice(0, 5),
    ])
  })
}
