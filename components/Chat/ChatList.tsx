import {FC, useEffect, useMemo, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, globalChatsStore} from 'chats'
import {useTranslation} from 'next-i18next'
import {size, isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import {useWindowSize} from 'react-use'
import {ArrowRight, VolumeUp} from 'react-iconly'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import SupportInterlocutor from 'icons/SupportInterlocutor.svg'
import ImageWrapper from '../ImageWrapper'
import {normalizeString, unixMlToDate} from '../../utils'
import EmptyProductImage from '../EmptyProductImage'
import EmptyTab from '../EmptyTab'
import ChatView from './ChatView'
import SelectChatPlaceholder from './SelectChatPlaceholder'
import Button from '../Buttons/Button'
import {useModalsStore} from '../../providers/RootStoreProvider'
import {setCookiesObject} from '../../helpers'
import {SerializedCookiesState} from '../../types'
import ChatListAvatar from './ChatListAvatar'

const filterChats = (chats: ChatData[], query: string) => {
  const normalizedQuery = normalizeString(query)

  if (!normalizedQuery) {
    return chats
  }
  return chats.filter((chat) => {
    const productTitle = normalizeString(chat.product.title)
    const ownerName = normalizeString(chat.interlocutor.name)
    const lastMessageText = normalizeString(chat.lastMessage.text)
    return (
      productTitle.includes(normalizedQuery) ||
      ownerName.includes(normalizedQuery) ||
      lastMessageText.includes(normalizedQuery)
    )
  })
}

const ChatList: FC = observer(() => {
  const {setModal} = useModalsStore()
  const [showBanner, setShowBanner] = useState(false)
  const {width} = useWindowSize()
  const {t} = useTranslation()
  const [query, setQuery] = useState('')
  const router = useRouter()
  const {chats} = globalChatsStore
  useEffect(() => {
    if (router.query.chatId && size(chats)) {
      const selected = chats.find((c) => c.id === router.query.chatId)
      if (selected) {
        setSelectedChat(selected)
      }
    }
  }, [chats, router.query.chatId])
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    if ('Notification' in window) {
      if (
        Notification.permission === 'default' &&
        state.hideNotificationRequest !== 'true'
      ) {
        setModal('REQUEST_NOTIFICATION', {
          onAccept: () => {
            setShowBanner(false)
            Notification.requestPermission().then()
          },
          onReject: () => {
            setCookiesObject({hideNotificationRequest: true})
          },
        })
      }
      if (Notification.permission !== 'granted') {
        setShowBanner(true)
      }
    }
  }, [])

  const filteredChats = useMemo(() => {
    return filterChats(chats, query)
  }, [chats, query])

  const [selectedChat, setSelectedChat] = useState<ChatData>(null)

  if (selectedChat && width < 1024) {
    return (
      <div className='flex flex-col s:px-8 s:py-6 s:bg-white s:drop-shadow-card s:rounded-3xl h-full'>
        <ChatView
          chat={selectedChat}
          onClose={() => {
            setSelectedChat(null)
            router.push(`/chat`, undefined, {
              shallow: true,
            })
          }}
        />
      </div>
    )
  }

  let height
  if (showBanner) {
    height = `max-h-[calc(100vh-350px)] m:max-h-[calc(100vh-340px)]`
  } else {
    height = `max-h-[calc(100vh-270px)] s:max-h-[calc(100vh-250px)] m:max-h-[calc(100vh-250px)]`
  }

  return (
    <div className='flex flex-col m:flex-row drop-shadow-card rounded-3xl py-4 px-3 m:pl-0 m:pr-6 bg-white h-full'>
      <div className='flex flex-col py-4 px-3 m:pl-0 m:pr-6'>
        <input
          className='bg-greyscale-100 rounded-xl py-3 px-5 mb-5 m:ml-6'
          placeholder={t('SEARCH_MESSAGES')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
        {showBanner && (
          <Button
            className='m:border-r m:border-greyscale-100 w-full m:w-[316px] l:w-[364px]'
            onClick={() => {
              Notification.requestPermission().then()
              setShowBanner(false)
            }}>
            <div className='flex p-4 bg-blue rounded-xl mb-4 items-center w-full m:ml-6 m:mr-2 text-left'>
              <div className='text-info mr-4'>
                <VolumeUp size={24} filled />
              </div>
              <div className='flex flex-col items-start'>
                <span className='text-body-14 font-semibold text-greyscale-900'>
                  {t('RECEIVE_NOTIFICATIONS')}
                </span>
                <div className='flex'>
                  <span className='text-body-12 text-greyscale-900 mr-1'>
                    {t('TURN_ON_NOTIFICATIONS')}
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Button>
        )}
        {!isEmpty(filteredChats) && (
          <div
            className={`flex flex-col overflow-y-auto overflow-x-hidden m:border-r m:border-greyscale-100 ${height} -mr-4 m:-mr-4`}>
            <div className='flex flex-col pr-4 m:pr-0'>
              {filteredChats.map((chat, index, array) => {
                const hasNewMessages = !!chat.newMessagesCount
                if (!chat.lastMessage.id) return null
                const lastMsg = (
                  <div className='flex justify-between w-full items-center'>
                    <span
                      className={`text-body-14 s:text-body-16 font-normal line-clamp-1 ${
                        hasNewMessages
                          ? 'text-greyscale-700'
                          : 'text-greyscale-500'
                      }`}>
                      {chat.lastMessage.text}
                    </span>
                    {hasNewMessages && (
                      <span className='shrink-0 text-body-12 s:text-body-14 font-semibold text-white bg-error rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center'>
                        {chat.newMessagesCount}
                      </span>
                    )}
                  </div>
                )
                const isSelected = selectedChat?.id === chat.id
                return (
                  <>
                    <div
                      tabIndex={0}
                      role='button'
                      key={chat.id}
                      className={`w-full m:w-[316px] l:w-[364px] m:pl-6 m:pr-4 ${
                        isSelected ? 'm:bg-greyscale-100 m:pt-3 m:-mt-3' : ''
                      }`}
                      onClick={() => {
                        setSelectedChat(chat)
                        router.push(`/chat?chatId=${chat.id}`, undefined, {
                          shallow: true,
                        })
                      }}>
                      <div className='rounded-3xl flex w-full flex-row'>
                        <ChatListAvatar chat={chat} />
                        <div className='flex flex-col  w-full'>
                          <div className='flex w-full justify-between'>
                            <span
                              className={`text-body-12 s:text-body-14 text-left line-clamp-1 font-medium m:font-normal ${
                                hasNewMessages
                                  ? 'text-greyscale-900'
                                  : 'text-greyscale-500'
                              }`}>
                              {chat.title}
                            </span>
                            <div className='flex justify-between items-center'>
                              {!!chat.lastMessage.date &&
                                chat.lastMessage.id && (
                                  <span
                                    className={`text-body-12 s:text-body-14 m:text-body-12 ${
                                      hasNewMessages
                                        ? 'text-greyscale-700'
                                        : 'text-greyscale-500'
                                    }`}>
                                    {unixMlToDate(chat.lastMessage.date)}
                                  </span>
                                )}
                              {/* <Button */}
                              {/*  className='space-x-1 text-greyscale-500 hover:text-primary-500 ml-6 hidden m:flex' */}
                              {/*  onClick={(e) => { */}
                              {/*    e.stopPropagation() */}
                              {/*    globalChatsStore.deleteChat(chat.id) */}
                              {/*  }}> */}
                              {/*  <Delete filled size={20} /> */}
                              {/*  <span className='text-body-14'> */}
                              {/*    {t('DELETE')} */}
                              {/*  </span> */}
                              {/* </Button> */}
                            </div>
                          </div>
                          <span
                            className={`text-body-12 s:text-body-14 font-semibold line-clamp-1 ${
                              hasNewMessages
                                ? 'text-greyscale-900'
                                : 'text-greyscale-500'
                            }`}>
                            {chat.product.title}
                          </span>
                          <div className='w-full'>{lastMsg}</div>
                        </div>
                      </div>
                    </div>
                    {index !== array.length - 1 && (
                      <div
                        style={{marginBottom: '12px'}}
                        className={`shrink-0 bg-greyscale-100 self-end w-full  mr-4 s:mr-0 ${
                          isSelected ? 'pt-3 bg-greyscale-100' : 'mt-3'
                        }`}>
                        <div className='h-px w-[calc(100%-32px)]' />
                      </div>
                    )}
                  </>
                )
              })}
            </div>
          </div>
        )}
        {isEmpty(filteredChats) && !selectedChat && (
          <div className='flex justify-center'>
            <EmptyTab
              description='MASSAGES_EMPTY'
              img='/img/empty-tabs/chat.png'
            />
          </div>
        )}
      </div>
      <div className='hidden m:flex w-full'>
        {selectedChat ? (
          <ChatView
            key={selectedChat.id}
            chat={selectedChat}
            onClose={() => {
              setSelectedChat(null)
              router.push(`/chat`, undefined, {
                shallow: true,
              })
            }}
          />
        ) : (
          <div className='flex items-center justify-center w-full'>
            <SelectChatPlaceholder />
          </div>
        )}
      </div>
    </div>
  )
})

export default ChatList
