import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {submitDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {params, shouldUpdate, dependencySequenceId} = body
  const storage = getStorageFromCookies({req, res})

  return submitDraft(storage, params, shouldUpdate, dependencySequenceId).then(
    (result) => {
      return res.json(result)
    },
  )
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
