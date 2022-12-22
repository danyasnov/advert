import {FC, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {toJS} from 'mobx'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'

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
            <div className='bg-white rounded-3xl p-6 flex'>
              <div className='relative'>
                <div className='rounded-[19px] overflow-hidden'>
                  <ImageWrapper
                    type={chat.product.image}
                    alt='image'
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='text-body-18 text-greyscale-900'>
                  {chat.user.name}
                </span>
                <span className='text-body-18 font-semibold text-greyscale-900'>
                  {chat.product.name}
                </span>
                <span className='text-body-16 font-normal text-greyscale-700'>
                  {chat.last_message.text}
                </span>
              </div>
              {/* {chat.id} */}
            </div>
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
  const {messages, sendMessage} = store
  useEffect(() => {
    console.log('store.fetchInitialMessages(),')
    store.fetchInitialMessages()
  }, [store])
  console.log('store.messages', messages)

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col'>
        {messages.map((m) => {
          return <div>{m.text}</div>
        })}
      </div>
      <div className='flex'>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button
          onClick={() => {
            setMessage('')
            sendMessage(message)
          }}>
          send
        </Button>
      </div>
    </div>
  )
})

export default ChatList
