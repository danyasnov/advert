import {parseCookies} from 'nookies'
import type {NextApiRequest, NextApiResponse} from 'next'
import {handleClickHouse} from '../../api/v2'
import {SerializedCookiesState} from '../../types'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const cookies: SerializedCookiesState = parseCookies({req})
  return handleClickHouse({
    eventType: body.eventType,
    sessionId: cookies.sessionId,
    token: cookies.authNewToken,
    data: body.data,
    user: cookies.hash,
  }).then((response) => {
    res.status(response.status)
    res.json({})
  })
}
