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
import {FormikText} from '../FormikComponents'
import SecondaryButton from '../Buttons/SecondaryButton'
import ChatItem from '../Chat/ChatItem'
import ChatHeader from '../Chat/ChatHeader'
import Message from '../Chat/Message'
import Auth from '../Auth'
import Messenger from '../Chat/Messenger'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()
  const {query, replace} = useRouter()
  const {chats} = globalChatsStore
  const chatsRef = useRef<Record<string, ChatStore>>({})
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

  return (
    <div className='flex mx-4 h-screen'>
      {!selectedChatId && (
        <div>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
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
                  chatsRef.current[chat.id] = new ChatStore(chat, user.hash)
                }

                chatsRef.current[chat.id].fetchBefore()
                setSelectedChatId(chat.id)
              }}
            />
          ))}
        </div>
      )}
      {selectedChatId && (
        <Messenger
          user={user}
          chatStore={chatsRef.current[selectedChatId]}
          onBack={() => {
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
          }}
        />
      )}
      <Auth hide />
    </div>
  )
})

export default ChatLayout
