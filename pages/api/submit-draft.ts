import type {NextApiRequest, NextApiResponse} from 'next'
import {processCookies} from '../../helpers'
import {submitDraft} from '../../api/v2'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const {params, shouldUpdate, dependencySequenceId} = body
  const state = await processCookies({req})

  return submitDraft(state, params, shouldUpdate, dependencySequenceId).then(
    (result) => {
      return res.json(result)
    },
  )
}
