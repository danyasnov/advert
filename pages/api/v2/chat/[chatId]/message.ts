import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../../../../helpers'
import {getRest} from '../../../../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {method, query, body} = req
  const {chatId} = query

  const storage = getStorageFromCookies({req, res})
  const rest = getRest(storage)
  const cb = (data) => {
    console.log('chat message', data)
    res.json(data.result)
  }
  console.log(req)

  if (method === 'GET') {
    return rest.chat.fetchChatMessages(chatId as string).then(cb)
  }
  if (method === 'POST') {
    return rest.chat
      .createNewMessage({chatId: chatId as string, text: body.data.text})
      .then(cb)
  }
}
