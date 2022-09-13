import type {NextApiRequest, NextApiResponse} from 'next'
import {fetchDependentFields} from '../../api/v2'
import {getStorageFromCookies} from '../../helpers'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  return fetchDependentFields(
    storage,
    body.dependenceSequenceId,
    body.dependenceSequence,
    body.otherValueWasSelected,
  ).then((response) => {
    res.json(response)
  })
}
