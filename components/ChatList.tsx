import {FC, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {toJS} from 'mobx'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import {unixToDate, unixToDateTime} from '../utils'

const ChatList: FC = observer(() => {
  const {chats} = globalChatsStore
  console.log('chats', JSON.parse(JSON.stringify(chats)))
  const [selectedChat, setSelectedChat] = useState<ChatData>(null)
  if (selectedChat) {
    return (
      <div className='flex flex-col'>
        <Button onClick={() => setSelectedChat(null)}>close</Button>
        <ChatView chat={selectedChat} />
      </div>
    )
  }
  return (
    <div className='flex flex-col space-y-4'>
      {chats.map((chat) => {
        return (
          <Button
            className='w-full'
            onClick={() => {
              setSelectedChat(chat)
            }}>
            <div className='bg-white rounded-3xl p-6 flex w-full'>
              <div className='relative w-20 h-20 mr-4'>
                <div className='rounded-[19px] overflow-hidden'>
                  <ImageWrapper
                    type={chat.product.image}
                    alt='image'
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <div className='flex flex-col w-full items-start'>
                <div className='flex justify-between w-full items-center'>
                  <span className='text-body-18 text-greyscale-900 text-left w-[240px] truncate text-body-18 font-medium'>
                    {chat.user.name}
                  </span>
                  {!!chat.last_message.created_at && (
                    <span className='text-body-16 text-greyscale-700'>
                      {unixToDate(chat.last_message.created_at)}
                    </span>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      globalChatsStore.deleteChat(chat.id)
                    }}>
                    remove
                  </Button>
                </div>
                <span className='text-body-18 font-semibold text-greyscale-900 pb-2'>
                  {chat.product.name}
                </span>
                <div className='flex justify-between w-full items-center'>
                  <span className='text-body-16 font-normal text-greyscale-700'>
                    {chat.last_message.text}
                  </span>
                  <span className='text-body-16 font-semibold text-primary-500 bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center'>
                    {chat.unread_messages}
                  </span>
                </div>
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
  console.log('store.messages', JSON.parse(JSON.stringify(messages)))

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
