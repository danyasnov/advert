import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {toJS} from 'mobx'
import {ArrowLeft, MoreCircle, Send} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import {groupBy} from 'lodash'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import {unixMlToDate, unixToDate, unixToDateTime} from '../utils'
import {useGeneralStore} from '../providers/RootStoreProvider'
import Message from './Chat/Message'

const ChatList: FC = observer(() => {
  const {chats} = globalChatsStore
  console.log('chats', JSON.parse(JSON.stringify(chats)))
  const [selectedChat, setSelectedChat] = useState<ChatData>(null)
  if (selectedChat) {
    return (
      <div className='flex flex-col'>
        <ChatView chat={selectedChat} onClose={() => setSelectedChat(null)} />
      </div>
    )
  }
  return (
    <div className='flex flex-col space-y-4'>
      {chats.map((chat) => {
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            tabIndex={0}
            role='button'
            key={chat.id}
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
                    {chat.title}
                  </span>
                  {!!chat.lastMessage.date && (
                    <span className='text-body-16 text-greyscale-700'>
                      {unixToDate(chat.lastMessage.date)}
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
                  {chat.product.title}
                </span>
                <div className='flex justify-between w-full items-center'>
                  <span className='text-body-16 font-normal text-greyscale-700'>
                    {chat.lastMessage.text}
                  </span>
                  <span className='text-body-16 font-semibold text-primary-500 bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center'>
                    {chat.newMessagesCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

const ChatView: FC<{chat: ChatData; onClose: () => void}> = observer(
  ({chat, onClose}) => {
    const {t} = useTranslation()
    const {user} = useGeneralStore()
    const messagesRef = useRef<HTMLDivElement>()

    const storeCreator = useCallback(
      () => new ChatStore(chat, user.hash),
      [chat],
    )
    const [messagesByDay, setMessagesByDay] = useState([])
    const [store] = useState(storeCreator)

    useEffect(() => {
      const messagesByDate = store.messages
        .slice()
        .reverse()
        .map((m) => {
          return {
            ...m,
            day: unixToDate(m.date),
          }
        })
      setMessagesByDay(Object.entries(groupBy(messagesByDate, 'day')))
    }, [store.messages])
    useEffect(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    }, [messagesByDay])
    const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
    const [message, setMessage] = useState('')
    const {sendMessage} = store
    useEffect(() => {
      store.fetchInitialMessages()
      if (!hasLoadedHistory) {
        store.fetchBefore()
        setHasLoadedHistory(true)
      }
    }, [store])
    const {interlocutor, product, id} = store.chat

    const submitMessage = useCallback(
      (text) => {
        setMessage('')
        sendMessage(text)
      },
      [sendMessage, setMessage],
    )

    return (
      <div className='flex flex-col bg-white rounded-3xl p-6 h-[752px] w-[464px]'>
        <div className='flex items-center mb-6'>
          <Button onClick={onClose}>
            <ArrowLeft size={28} />
          </Button>
          <div className='w-10 h-10 rounded-full bg-gray-300 mx-4'>
            {!!interlocutor.avatarSrc && (
              <ImageWrapper
                height={40}
                width={40}
                type={interlocutor.avatarSrc}
                alt='avatar'
              />
            )}
          </div>
          <div className='flex flex-col'>
            <span className='text-body-16 font-semibold text-greyscale-900 w-[276px] truncate'>
              {interlocutor.name}
            </span>
            <span
              className={`text-body-14 font-semibold ${
                interlocutor.online ? 'text-green' : 'text-greyscale-600'
              }`}>
              {interlocutor.online ? t('ONLINE') : t('OFFLINE')}
            </span>
          </div>
          <Button className='ml-4'>
            <MoreCircle size={24} />
          </Button>
        </div>
        <div className='border border-greyscale-300 rounded-2xl p-3 bg-greyscale-50 flex items-center'>
          <div className='rounded-2xl w-[56px] h-[56px] mr-4 bg-gray-300'>
            {!!product.image && (
              <ImageWrapper
                type={product.image}
                alt='product'
                width={56}
                height={56}
              />
            )}
          </div>
          <span className='text-body-16 text-greyscale-900'>
            {product.title}
          </span>
        </div>
        <div
          ref={messagesRef}
          className='flex flex-col h-[500px] w-full overflow-y-scroll'>
          {messagesByDay.map((messagesGroup) => {
            const [title, messages] = messagesGroup
            const today = unixMlToDate(+new Date())
            return (
              <>
                <div className='flex items-center mb-5'>
                  <div className='w-full h-px bg-gray-200' />
                  <span className='px-2 text-body-14 text-gray-500'>
                    {title === today ? t('TODAY') : title}
                  </span>
                  <div className='w-full h-px bg-gray-200' />
                </div>
                {messages.map((m) => {
                  return <Message message={m} user={user} />
                })}
              </>
            )
          })}
        </div>
        <div className='bg-greyscale-50 rounded-[20px] overflow-hidden flex py-2'>
          <TextareaAutosize
            maxRows={5}
            minRows={1}
            placeholder={t('START_TYPE')}
            maxLength={1000}
            className='w-full text-body-14 text-grayscale-900 pl-12 overflow-y-scroll bg-greyscale-50 manual-outline outline-none resize-none'
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey === false) {
                e.preventDefault()
                submitMessage(message)
              }
            }}
          />
          <div className='w-12 flex items-end'>
            {message && (
              <Button
                onClick={() => {
                  submitMessage(message)
                }}
                className='text-primary-500'>
                <Send size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

export default ChatList
