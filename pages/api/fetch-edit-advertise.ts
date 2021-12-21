import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {fetchEditAdvertise} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  return fetchEditAdvertise(state, body.hash).then((result) => {
    return res.json(result)
  })
}
