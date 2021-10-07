import type {NextApiRequest, NextApiResponse} from 'next'
import {parseCookies} from 'nookies'
import {deleteAdv} from '../../api/v2'
import {SerializedCookiesState} from '../../types'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const state: SerializedCookiesState = parseCookies({req})
  return deleteAdv(body.hash, state.language, state.token, state.hash).then(
    (result) => {
      return res.json(result)
    },
  )
}
