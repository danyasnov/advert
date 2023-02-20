import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../../../../../helpers'
import {getRest} from '../../../../../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {method, query} = req
  const {chatId, messageId} = query

  const storage = getStorageFromCookies({req, res})
  const rest = getRest(storage)
  const cb = (data) => {
    res.json(data.result)
  }

  if (method === 'POST') {
    return rest.chat
      .markAsRead({chatId: chatId as string, messageId: messageId as string})
      .then(cb)
  }
}
