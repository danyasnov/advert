import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchCategoryData} from '../../api/v2'
import {processCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})
  return fetchCategoryData(state, body.id, body.editFields).then((response) => {
    res.json(response)
  })
}
