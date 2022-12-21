import {FC, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {toJS} from 'mobx'
import Button from './Buttons/Button'

const ChatList: FC = observer(() => {
  const {chats} = globalChatsStore
  console.log('chats', JSON.parse(JSON.stringify(chats)))
  const [selectedChat, setSelectedChat] = useState<ChatData>()
  if (selectedChat) {
    return <ChatView chat={selectedChat} />
  }
  return (
    <div className='flex flex-col'>
      {chats.map((chat) => {
        return (
          <Button
            onClick={() => {
              setSelectedChat(chat)
            }}>
            {chat.id}
          </Button>
        )
      })}
    </div>
  )
})

const ChatView: FC<{chat: ChatData}> = observer(({chat}) => {
  const storeCreator = useCallback(() => new ChatStore(chat), [chat])
  const [message, setMessage] = useState('')
  const [store, updateStore] = useState(storeCreator)
  useEffect(() => {
    console.log('store.fetchInitialMessages(),')
    store.fetchInitialMessages()
  }, [store])
  console.log(store)

  return (
    <div className='flex'>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button
        onClick={() => {
          setMessage('')
          store.sendMessage(message)
        }}>
        send
      </Button>
    </div>
  )
})

export default ChatList
