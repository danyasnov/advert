import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchCategoryData} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return fetchCategoryData(storage, body.id, body.editFields).then(
    (response) => {
      res.json(response)
    },
  )
}
