import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {ChatData, ChatStore, globalChatsStore} from 'chats'
import {ArrowLeft, Delete, Send} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import {groupBy, size, isEmpty} from 'lodash'
import TextareaAutosize from 'react-textarea-autosize'
import {useRouter} from 'next/router'
import {useWindowSize} from 'react-use'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import UserAvatar from '../UserAvatar'
import {unixMlToDate} from '../../utils'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import Message from './Message'
import EmptyProductImage from '../EmptyProductImage'
import LinkWrapper from '../Buttons/LinkWrapper'
import EmptyTab from '../EmptyTab'
import {robustShallowUpdateQuery} from '../../helpers'
import RequestNotificationModal from '../Modals/RequestNotificationModal'
import ChatView from './ChatView'
import SelectChatPlaceholder from './SelectChatPlaceholder'

const ChatList: FC = observer(() => {
  const [showModal, setShowModal] = useState(false)
  const {width} = useWindowSize()
  const {t} = useTranslation()
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
    if ('Notification' in window && Notification.permission === 'default') {
      setShowModal(true)
    }
  }, [])

  const [selectedChat, setSelectedChat] = useState<ChatData>(null)

  if (selectedChat && width < 1024) {
    return (
      <div className='flex flex-col s:px-8 s:py-6 s:bg-white s:drop-shadow-card s:rounded-3xl'>
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

  return (
    <div className='flex flex-col m:flex-row drop-shadow-card rounded-3xl py-4 px-3 m:pl-0 bg-white'>
      <div className='flex flex-col py-4 px-3 m:pl-0 m:pr-6'>
        {/* <input */}
        {/*  className='bg-greyscale-100 rounded-xl py-3 px-5 mb-5 m:ml-6' */}
        {/*  placeholder='SEARCH_MESSAGES' */}
        {/* /> */}
        {!isEmpty(chats) && (
          <div className='flex flex-col max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden  m:border-r m:border-greyscale-100'>
            {chats.map((chat, index, array) => {
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
                    <span className='text-body-12 s:text-body-14 font-semibold text-primary-500 bg-primary-100 rounded-full w-6 h-6 s:w-8 s:h-8 flex items-center justify-center'>
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
                      <div className='relative  mr-4 flex items-center justify-center'>
                        {chat.product.image ? (
                          <div className='rounded-2xl overflow-hidden w-[52px] h-[52px] relative'>
                            <ImageWrapper
                              type={chat.product.image}
                              alt='image'
                              layout='fill'
                              objectFit='cover'
                            />
                          </div>
                        ) : (
                          <EmptyProductImage size={52} />
                        )}
                      </div>
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
                            {!!chat.lastMessage.date && chat.lastMessage.id && (
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
        )}
        {isEmpty(chats) && !selectedChat && (
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
      {showModal && (
        <RequestNotificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAccept={() => {
            setShowModal(false)
            Notification.requestPermission().then()
          }}
        />
      )}
    </div>
  )
  // return (
  //   <>
  //     {!!selectedChat && (
  //       <div className='flex flex-col'>
  //         <ChatView
  //           chat={selectedChat}
  //           onClose={() => {
  //             setSelectedChat(null)
  //             robustShallowUpdateQuery(router, {page: 'chat'})
  //           }}
  //         />
  //       </div>
  //     )}
  //     {!isEmpty(chats) && !selectedChat && (
  //       <div className='flex flex-col space-y-4'>
  //         {chats.map((chat) => {
  //           const hasNewMessages = !!chat.newMessagesCount
  //           const lastMsg = (
  //             <div className='flex justify-between w-full items-center mt-2 s:mt-0'>
  //               <span
  //                 className={`text-body-14 s:text-body-16 font-normal truncate w-[264px] s:w-[236px] m:w-[370px] ${
  //                   hasNewMessages ? 'text-greyscale-700' : 'text-greyscale-500'
  //                 }`}>
  //                 {chat.lastMessage.text}
  //               </span>
  //               {hasNewMessages && (
  //                 <span className='text-body-12 s:text-body-16 font-semibold text-primary-500 bg-primary-100 rounded-full w-6 h-6 s:w-8 s:h-8 flex items-center justify-center'>
  //                   {chat.newMessagesCount}
  //                 </span>
  //               )}
  //             </div>
  //           )
  //           return (
  //             // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  //             <div
  //               tabIndex={0}
  //               role='button'
  //               key={chat.id}
  //               className='w-full'
  //               onClick={() => {
  //                 setSelectedChat(chat)
  //                 router.push(
  //                   `/user/${router.query.id}?chatId=${chat.id}`,
  //                   undefined,
  //                   {
  //                     shallow: true,
  //                   },
  //                 )
  //               }}>
  //               <div className='bg-white rounded-3xl p-4 s:p-6 flex w-full flex-col s:flex-row'>
  //                 <div className='flex w-full'>
  //                   <div className='relative  mr-4 flex items-center justify-center'>
  //                     {chat.product.image ? (
  //                       <div className='rounded-[19px] overflow-hidden w-[52px] h-[52px] s:w-20 s:h-20'>
  //                         <ImageWrapper
  //                           type={chat.product.image}
  //                           alt='image'
  //                           layout='fill'
  //                           objectFit='cover'
  //                         />
  //                       </div>
  //                     ) : (
  //                       <>
  //                         <div className='s:hidden'>
  //                           <EmptyProductImage size={52} />
  //                         </div>
  //                         <div className='hidden s:block'>
  //                           <EmptyProductImage size={80} />
  //                         </div>
  //                       </>
  //                     )}
  //                   </div>
  //                   <div className='flex flex-col s:flex-row w-full'>
  //                     <div className='flex flex-col w-full items-start'>
  //                       <div className='flex justify-between w-full items-center'>
  //                         <span
  //                           className={`text-body-14 s:text-body-18 text-left w-[137px] s:w-[240px] truncate font-medium ${
  //                             hasNewMessages
  //                               ? 'text-greyscale-900'
  //                               : 'text-greyscale-500'
  //                           }`}>
  //                           {chat.title}
  //                         </span>
  //                         <div className='flex justify-between'>
  //                           {!!chat.lastMessage.date && (
  //                             <span
  //                               className={`text-body-14 s:text-body-16 ${
  //                                 hasNewMessages
  //                                   ? 'text-greyscale-700'
  //                                   : 'text-greyscale-500'
  //                               }`}>
  //                               {unixMlToDate(chat.lastMessage.date)}
  //                             </span>
  //                           )}
  //                           <Button
  //                             className='space-x-1 text-greyscale-500 hover:text-primary-500 ml-6 hidden m:flex'
  //                             onClick={(e) => {
  //                               e.stopPropagation()
  //                               globalChatsStore.deleteChat(chat.id)
  //                             }}>
  //                             <Delete filled size={20} />
  //                             <span className='text-body-14'>
  //                               {t('DELETE')}
  //                             </span>
  //                           </Button>
  //                         </div>
  //                       </div>
  //                       <span
  //                         className={`text-body-18 font-semibold pb-2 ${
  //                           hasNewMessages
  //                             ? 'text-greyscale-900'
  //                             : 'text-greyscale-500'
  //                         }`}>
  //                         {chat.product.title}
  //                       </span>
  //                       <div className='hidden s:block w-full'>{lastMsg}</div>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div className='block s:hidden w-full'>{lastMsg}</div>
  //               </div>
  //             </div>
  //           )
  //         })}
  //       </div>
  //     )}

  //   </>
  // )
})

export default ChatList
