import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../../../../helpers'
import {getRest} from '../../../../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {method, query} = req
  const {chatId} = query

  const storage = getStorageFromCookies({req, res})
  const rest = getRest(storage)
  const cb = (data) => {
    res.json(data.result)
  }

  if (method === 'GET') {
    return rest.chat.fetchChat(chatId as string).then(cb)
  }
  if (method === 'DELETE') {
    return rest.chat.deleteChat(chatId as string).then(cb)
  }
}
