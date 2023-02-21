import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {toJS} from 'mobx'
import {
  ArrowLeft,
  CloseSquare,
  Delete,
  MoreCircle,
  Send,
  User,
} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import {groupBy, size, isEmpty} from 'lodash'
import TextareaAutosize from 'react-textarea-autosize'
import {useRouter} from 'next/router'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import {unixMlToDate, unixToDate} from '../utils'
import {useGeneralStore} from '../providers/RootStoreProvider'
import Message from './Chat/Message'
import EmptyProductImage from './EmptyProductImage'
import LinkWrapper from './Buttons/LinkWrapper'
import EmptyTab from './EmptyTab'

const ChatList: FC = observer(() => {
  const {t} = useTranslation()
  const {query, push} = useRouter()
  const {chats} = globalChatsStore
  useEffect(() => {
    if (query.chatId && size(chats)) {
      const selected = chats.find((c) => c.id === query.chatId)
      if (selected) {
        setSelectedChat(selected)
      }
    }
  }, [chats, query.chatId])
  const [selectedChat, setSelectedChat] = useState<ChatData>(null)
  if (selectedChat) {
    return (
      <div className='flex flex-col'>
        <ChatView
          chat={selectedChat}
          onClose={() => {
            setSelectedChat(null)
            push(`/user/${query.id}`, undefined, {
              shallow: true,
            })
          }}
        />
      </div>
    )
  }
  return (
    <div className='flex flex-col space-y-4'>
      {chats.map((chat) => {
        const hasNewMessages = !!chat.newMessagesCount
        const lastMsg = (
          <div className='flex justify-between w-full items-center mt-2 s:mt-0'>
            <span
              className={`text-body-14 s:text-body-16 font-normal truncate w-[264px] s:w-[236px] m:w-[370px] ${
                hasNewMessages ? 'text-greyscale-700' : 'text-greyscale-500'
              }`}>
              {chat.lastMessage.text}
            </span>
            {hasNewMessages && (
              <span className='text-body-12 s:text-body-16 font-semibold text-primary-500 bg-primary-100 rounded-full w-6 h-6 s:w-8 s:h-8 flex items-center justify-center'>
                {chat.newMessagesCount}
              </span>
            )}
          </div>
        )
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            tabIndex={0}
            role='button'
            key={chat.id}
            className='w-full'
            onClick={() => {
              setSelectedChat(chat)
              push(`/user/${query.id}?chatId=${chat.id}`, undefined, {
                shallow: true,
              })
            }}>
            <div className='bg-white rounded-3xl p-4 s:p-6 flex w-full flex-col s:flex-row'>
              <div className='flex w-full'>
                <div className='relative  mr-4 flex items-center justify-center'>
                  {chat.product.image ? (
                    <div className='rounded-[19px] overflow-hidden w-[52px] h-[52px] s:w-20 s:h-20'>
                      <ImageWrapper
                        type={chat.product.image}
                        alt='image'
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                  ) : (
                    <>
                      <div className='s:hidden'>
                        <EmptyProductImage size={52} />
                      </div>
                      <div className='hidden s:block'>
                        <EmptyProductImage size={80} />
                      </div>
                    </>
                  )}
                </div>
                <div className='flex flex-col s:flex-row w-full'>
                  <div className='flex flex-col w-full items-start'>
                    <div className='flex justify-between w-full items-center'>
                      <span
                        className={`text-body-14 s:text-body-18 text-left w-[137px] s:w-[240px] truncate font-medium ${
                          hasNewMessages
                            ? 'text-greyscale-900'
                            : 'text-greyscale-500'
                        }`}>
                        {chat.title}
                      </span>
                      <div className='flex justify-between'>
                        {!!chat.lastMessage.date && (
                          <span
                            className={`text-body-14 s:text-body-16 ${
                              hasNewMessages
                                ? 'text-greyscale-700'
                                : 'text-greyscale-500'
                            }`}>
                            {unixToDate(chat.lastMessage.date)}
                          </span>
                        )}
                        <Button
                          className='space-x-1 text-greyscale-500 hover:text-primary-500 ml-6 hidden m:flex'
                          onClick={(e) => {
                            e.stopPropagation()
                            globalChatsStore.deleteChat(chat.id)
                          }}>
                          <Delete filled size={20} />
                          <span className='text-body-14'>{t('DELETE')}</span>
                        </Button>
                      </div>
                    </div>
                    <span
                      className={`text-body-18 font-semibold pb-2 ${
                        hasNewMessages
                          ? 'text-greyscale-900'
                          : 'text-greyscale-500'
                      }`}>
                      {chat.product.title}
                    </span>
                    <div className='hidden s:block w-full'>{lastMsg}</div>
                  </div>
                </div>
              </div>
              <div className='block s:hidden w-full'>{lastMsg}</div>
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <div className='flex justify-center'>
      <EmptyTab description='MASSAGES_EMPTY' img='/img/empty-tabs/chat.png' />
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
    const [message, setMessage] = useState('')
    const {sendMessage} = store
    useEffect(() => {
      store.fetchBefore()
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
      <div className='flex flex-col bg-white rounded-3xl p-6 h-[752px] w-full'>
        <div className='flex items-center mb-6'>
          <Button onClick={onClose}>
            <ArrowLeft size={28} />
          </Button>
          <div className='w-10 h-10 rounded-full bg-gray-300 mx-4'>
            <UserAvatar
              size={10}
              name={interlocutor.name}
              url={interlocutor.avatarSrc}
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-body-16 font-semibold text-greyscale-900 w-[160px] s:w-[276px] truncate'>
              {interlocutor.name}
            </span>
            <span
              className={`text-body-14 font-semibold ${
                interlocutor.online ? 'text-green' : 'text-greyscale-600'
              }`}>
              {interlocutor.online ? t('ONLINE') : t('OFFLINE')}
            </span>
          </div>
          {/* <Button className='ml-4'> */}
          {/*  <MoreCircle size={24} /> */}
          {/* </Button> */}
        </div>
        <LinkWrapper
          href={`/b/${product.id}`}
          title='product link'
          target='_blank'>
          <div className='border border-greyscale-300 rounded-2xl p-3 bg-greyscale-50 flex items-center'>
            <div className='mr-4'>
              {product.image ? (
                <div className='rounded-2xl relative overflow-hidden w-[56px] h-[56px]'>
                  <ImageWrapper
                    type={product.image}
                    alt='product'
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              ) : (
                <EmptyProductImage size={56} />
              )}
            </div>
            <span className='text-body-16 text-greyscale-900'>
              {product.title}
            </span>
          </div>
        </LinkWrapper>

        <div
          ref={messagesRef}
          className='flex flex-col h-[520px] w-full overflow-y-scroll'>
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
