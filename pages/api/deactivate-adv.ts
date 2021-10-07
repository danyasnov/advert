import type {NextApiRequest, NextApiResponse} from 'next'
import {parseCookies} from 'nookies'
import {deactivateAdv} from '../../api/v2'
import {SerializedCookiesState} from '../../types'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const state: SerializedCookiesState = parseCookies({req})
  return deactivateAdv(
    body.hash,
    body.soldMode,
    state.language,
    state.token,
    state.hash,
  ).then((result) => {
    return res.json(result)
  })
}
