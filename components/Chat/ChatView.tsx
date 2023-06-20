import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {ChatData, ChatStore} from 'chats'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {groupBy} from 'lodash'
import {ArrowLeft, Send} from 'react-iconly'
import TextareaAutosize from 'react-textarea-autosize'
import {useRouter} from 'next/router'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import {unixMlToDate} from '../../utils'
import Button from '../Buttons/Button'
import UserAvatar from '../UserAvatar'
import LinkWrapper from '../Buttons/LinkWrapper'
import ImageWrapper from '../ImageWrapper'
import EmptyProductImage from '../EmptyProductImage'
import Message from './Message'

const ChatView: FC<{chat: ChatData; onClose: () => void}> = observer(
  ({chat, onClose}) => {
    const {t} = useTranslation()
    const {user} = useGeneralStore()
    const messagesRef = useRef<HTMLDivElement>()

    const router = useRouter()
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
        .filter((m) => m.type === 'text')
        .map((m) => {
          let isLink
          try {
            const url = new URL(m.text)
            isLink = url.hostname.endsWith('vooxee.com')
          } catch (e) {
            isLink = false
          }
          return {
            ...m,
            isLink,
            day: unixMlToDate(m.date),
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
      <div className='flex flex-col bg-white rounded-3xl w-full m:mt-5 h-full max-h-[calc(100vh-150px)] s:max-h-[calc(100vh-150px)] m:max-h-[calc(100vh-180px)]'>
        <Button
          onClick={onClose}
          className='self-start space-x-2 mb-5 m:hidden'>
          <ArrowLeft size={20} />
          <span className='text-body-12 text-greyscale-900'>
            {t('BACK_TO_ALL_CHATS')}
          </span>
        </Button>
        <LinkWrapper
          href={`/user/${interlocutor.id}`}
          title={interlocutor.name}
          target='_blank'
          className='self-start mb-6 flex w-full'>
          <div className='w-10 h-10 rounded-full bg-gray-300 mx-4'>
            <UserAvatar
              size={10}
              name={interlocutor.name}
              url={interlocutor.avatarSrc}
            />
          </div>
          <div className='flex flex-col text-left w-full'>
            <span className='text-body-16 font-semibold text-greyscale-900 line-clamp-1 w-full'>
              {interlocutor.name}
            </span>
            <span
              className={`text-body-14 font-semibold ${
                interlocutor.online ? 'text-green' : 'text-greyscale-600'
              }`}>
              {interlocutor.online ? t('ONLINE') : t('OFFLINE')}
            </span>
          </div>
        </LinkWrapper>
        <LinkWrapper
          href={`/b/${product.id}`}
          title='product link'
          target='_blank'>
          <div className='border border-greyscale-300 rounded-2xl p-3 bg-greyscale-50 flex items-center'>
            <div className='mr-4'>
              {product.image ? (
                <div className='rounded-xl relative overflow-hidden w-[40px] h-[40px] s:w-[56px] s:h-[56px]'>
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
          className='flex flex-col h-full flex-shrink basis-full max-h-full w-full overflow-y-scroll'>
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
        <div className='bg-greyscale-50 rounded-[20px] overflow-hidden flex py-2 shrink-0'>
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

export default ChatView
