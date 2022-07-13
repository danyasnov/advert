import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {toJS} from 'mobx'
import {Chats, ChatStore, globalChatsStore} from 'chats'
import {Form, useFormik, FormikProvider, Field} from 'formik'
import {object, string} from 'yup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {SerializedCookiesState} from '../../types'
import {getRest} from '../../api'
import {mapCookies} from '../../helpers'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import ImageWrapper from '../ImageWrapper'
import {
  unixMlToDate,
  unixMlToDateTime,
  unixToDate,
  unixToDateTime,
} from '../../utils'
import UserAvatar from '../UserAvatar'
import Button from '../Buttons/Button'
import {FormikText} from '../FormikComponents'
import SecondaryButton from '../Buttons/SecondaryButton'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()
  const {query, replace} = useRouter()
  const {chats} = globalChatsStore
  const chatsRef = useRef({})
  const messagesRef = useRef()
  const [selectedChatId, setSelectedChatId] = useState('')

  const openChat = () => {}
  const startChat = () => {}

  useEffect(() => {
    if (!user) return

    const init = async () => {
      const state: SerializedCookiesState = parseCookies()
      const storage = mapCookies(state)
      const restApi = getRest(storage)
      Chats.init({
        deps: {
          restApi,
          t,
          langProvider: () => 'ru',
          ui: {showLoading: () => {}, hideLoading: () => {}},
          notifier: {
            showNotifierSuccess: (message) => {
              console.log('🔦 SUCC')
              // showNotifierSuccess({message})
            },
            showNotifierError: (message) => {
              console.log('🔦 ERR', message)
              // showNotifierError({message})
            },
          },
          system: {
            mediaPathMapper: () => '',
            loadDisabledAutoTranslationChatIds: async () => new Set(),
            saveDisabledAutoTranslationChatIds: async () => new Set(),
            sendMedia: async () => new Set(),
          },
        },
        options: {
          isStaging: false,
          debug: true,
          connectionParams: async () => ({
            secur: state.authNewToken,
            hash: state.hash,
            device_id: 'web',
            device_model: 'web',
            device_type: 'web',
            install_id: '',
            os_version: 'web',
            timezone_offset: 0,
          }),
          chatsEndpointOverrides: 'wss://backend.venera.city',
        },
      })
      globalChatsStore.init({
        id: user.hash,
        name: user.name,
        avatarSrc: user.imageUrl,
        updatedAt: 0,
        surname: '',
        onlineLastTime: 0,
        online: user.isOnline,
        langCode: user.mainLanguage.isoCode,
      })

      const error = await globalChatsStore.startConnection()

      // console.log('error', error)

      await globalChatsStore.fetchMoreChats()
      // console.log('globalChatsStore', toJS(globalChatsStore))

      if (query.hash) {
        let chatData = globalChatsStore.chats.find(
          (chat) => chat.product.id === query.hash,
        )
        if (!chatData) {
          chatData = await globalChatsStore.createChat(query.hash as string)
        }

        chatsRef.current[chatData.id] = new ChatStore(chatData, user.hash)

        if (chatData) {
          await chatsRef.current[chatData.id].fetchBefore()
          setSelectedChatId(chatData.id)
        }
      }
    }
    init()
  }, [user])

  useEffect(() => {
    console.log(
      'chatsRef.current[selectedChatId]',
      toJS(chatsRef.current[selectedChatId]),
    )
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [chatsRef.current[selectedChatId]?.messages])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: '',
    },
    validate: (values) => {
      const errors = {}
      const schema = object().shape({
        message: string()
          .required(t('TOO_SHORT_NAME_OR_SURNAME'))
          .max(90, t('TOO_SHORT_NAME_OR_SURNAME')),
      })

      try {
        schema.validateSync(values, {
          abortEarly: false,
        })
      } catch (e) {
        e.inner.forEach(({path, message}) => {
          errors[path] = message
        })
      }
      // console.log('errors', errors)

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, actions) => {
      const response = await chatsRef.current[selectedChatId].sendMessage(
        values.message,
      )
      if (!response) {
        const error = await globalChatsStore.startConnection()
        await chatsRef.current[selectedChatId].sendMessage(values.message)
      }
      console.log('response', response)
      actions.resetForm()
    },
  })

  console.log(toJS(globalChatsStore))
  return (
    <HeaderFooterWrapper>
      <div className=' py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12'>
            <div className='flex mx-4 h-[60vh]'>
              {!selectedChatId && (
                <div>
                  {chats.map((chat) => {
                    return (
                      <Button
                        key={chat.id}
                        onClick={async () => {
                          replace(
                            {
                              query: {
                                hash: chat.product.id,
                              },
                            },
                            undefined,
                            {shallow: true},
                          )
                          if (!chatsRef.current[chat.id]) {
                            chatsRef.current[chat.id] = new ChatStore(
                              chat,
                              user.hash,
                            )
                          }

                          // console.log(
                          //   'chatsRef.current[chat.id]',
                          //   toJS(chatsRef.current[chat.id]),
                          // )
                          chatsRef.current[chat.id].fetchBefore()
                          setSelectedChatId(chat.id)
                        }}>
                        <div className='flex'>
                          <div className='w-20 h-20'>
                            <ImageWrapper
                              width={80}
                              height={80}
                              type={chat.product.image}
                              alt={chat.product.image}
                            />
                          </div>

                          <div className='w-40 text-left'>
                            <p className='truncate'>
                              {chat.interlocutor.name}
                              {chat.interlocutor.surname}
                            </p>
                            {chat.lastMessage && (
                              <p className='truncate'>
                                {chat.lastMessage.originalText}
                              </p>
                            )}
                          </div>
                          <div className='w-20'>
                            {chat.lastMessage && (
                              <p>{unixMlToDate(chat.lastMessage.date)}</p>
                            )}
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              )}
              {selectedChatId && (
                <div className='flex flex-col w-full '>
                  <SecondaryButton
                    onClick={() => {
                      setSelectedChatId(null)
                      replace(
                        {
                          query: {
                            hash: undefined,
                          },
                        },
                        undefined,
                        {shallow: true},
                      )
                    }}>
                    close
                  </SecondaryButton>
                  <div
                    className='flex flex-col overflow-y-auto	'
                    ref={messagesRef}>
                    {chatsRef.current[selectedChatId].messages
                      .slice()
                      .reverse()
                      .map((m) => (
                        <span
                          className={`${
                            m.userId === user.hash ? 'self-end' : 'self-start'
                          }`}>
                          {m.originalText}
                          {/* {JSON.stringify(m, null, 2)} */}
                        </span>
                      ))}
                  </div>
                  <FormikProvider value={formik}>
                    <Form>
                      <Field
                        name='message'
                        component={FormikText}
                        isTextarea
                        submitOnEnter
                        rows={3}
                        placeholder={t('SEND_A_MESSAGE')}
                      />
                    </Form>
                  </FormikProvider>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default ChatLayout
