import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchBanners} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  return fetchBanners().then((response) => {
    res.json(response)
  })
}
