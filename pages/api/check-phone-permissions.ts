import type {NextApiRequest, NextApiResponse} from 'next'
import {parseCookies} from 'nookies'
import {getRest, makeRequest, parseIp} from '../../api'
import {SerializedCookiesState} from '../../types'
import Storage, {StorageOptions} from '../../stores/Storage'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const {hash} = body
  const state: SerializedCookiesState = parseCookies({req})
  const ip = parseIp(req)
  const storage = new Storage(state as unknown as StorageOptions)
  const rest = getRest(storage)
  return makeRequest({
    method: 'post',
    url: `${process.env.API_URL}/v2/products/check-phone-permissions`,
    data: {
      data: {
        hash,
      },
      headers: {
        lang: {
          code: state.language,
        },
        location: JSON.parse(state.userLocation),
        user: state.hash ? {hash: state.hash} : null,
        security: {
          token: rest.secure.createUserSecure(),
        },
      },
    },
    headers: {
      'x-adverto-client-ip': ip,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    return res.json(response.data)
  })
}
