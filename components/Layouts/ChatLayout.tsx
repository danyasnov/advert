import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {toJS} from 'mobx'
import {Chats, ChatStore, globalChatsStore} from 'chats'
import {Form, useFormik, FormikProvider, Field} from 'formik'
import {object, string} from 'yup'
import WebSocket, {WebSocketServer} from 'ws'
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
      // const storage = mapCookies(state)
      // const restApi = getRest(storage)
      const wss = new WebSocketServer({
        port: 8080,
        perMessageDeflate: {
          zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024,
          },
          // Other options settable:
          clientNoContextTakeover: true, // Defaults to negotiated value.
          serverNoContextTakeover: true, // Defaults to negotiated value.
          serverMaxWindowBits: 10, // Defaults to negotiated value.
          // Below options specified as default values.
          concurrencyLimit: 10, // Limits zlib concurrency for perf.
          threshold: 1024, // Size (in bytes) below which messages
          // should not be compressed if context takeover is disabled.
        },
      })
    }
    init()
  }, [user])

  return null

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
