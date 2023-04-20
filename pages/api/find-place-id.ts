import type {NextApiRequest, NextApiResponse} from 'next'
import {getRest} from '../../api'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})
  const rest = getRest(storage)
  return rest.google.fetchPlaceInfo(body.placeId as string).then((r) => {
    res.json(r)
  })
}
