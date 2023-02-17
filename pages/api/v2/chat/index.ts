import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../../../helpers'
import {getRest} from '../../../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {method, body} = req

  // eslint-disable-next-line camelcase
  const {product_hash} = body
  const storage = getStorageFromCookies({req, res})
  const rest = getRest(storage)
  const cb = (data) => {
    res.json(data.result)
  }

  if (method === 'GET') {
    return rest.chat.fetchChats().then(cb)
  }
  if (method === 'POST') {
    // eslint-disable-next-line camelcase
    return rest.chat.createChat({productHash: product_hash}).then(cb)
  }
}
