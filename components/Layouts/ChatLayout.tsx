import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import {SerializedCookiesState} from '../../types'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import HeaderFooterWrapper from './HeaderFooterWrapper'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()
  const pingPongRef = useRef<any>()
  console.log('user', toJS(user))

  useEffect(() => {
    if (!user) return
    const state: SerializedCookiesState = parseCookies()
    console.log('state', state, toJS(user))
    const socket = new WebSocket('wss://backend.venera.city/ws/')
    socket.onopen = function (e) {
      console.log('connected')
      pingPongRef.current = setInterval(() => {
        socket.send(
          JSON.stringify({
            method: 'ping',
            params: {},
          }),
        )
      }, 5000)
      socket.send(
        JSON.stringify({
          method: 'login',
          params: {
            token: state.authNewToken,
            // информация о клиенте
            // device_id: 'web',
            // device_type: 3,
            // device_model: 'model',
            // os_version: 'macos',
            // install_id: 'install-1',
            // timezone_offset: 0,
          },
        }),
      )
    }

    socket.onmessage = function (event) {
      console.log('onmessage', event, JSON.parse(event.data))
    }

    socket.onclose = function (event) {
      console.log('onclose', event)
    }

    socket.onerror = function (error) {
      console.log('onerror', error)
    }
    return () => {
      socket.close()
      clearInterval(pingPongRef.current)
    }
  }, [user])

  return <HeaderFooterWrapper>qwerty</HeaderFooterWrapper>

  // return (
  //   <div className='flex mx-4 h-screen'>
  //     {!selectedChatId && (
  //       <div>
  //         {chats.map((chat) => (
  //           <ChatItem
  //             key={chat.id}
  //             chat={chat}
  //             onClick={async () => {
  //               replace(
  //                 {
  //                   query: {
  //                     hash: chat.product.id,
  //                   },
  //                 },
  //                 undefined,
  //                 {shallow: true},
  //               )
  //               if (!chatsRef.current[chat.id]) {
  //                 chatsRef.current[chat.id] = new ChatStore(chat, user.hash)
  //               }
  //
  //               chatsRef.current[chat.id].fetchBefore()
  //               setSelectedChatId(chat.id)
  //             }}
  //           />
  //         ))}
  //       </div>
  //     )}
  //     {selectedChatId && (
  //       <Messenger
  //         user={user}
  //         chatStore={chatsRef.current[selectedChatId]}
  //         onBack={() => {
  //           setSelectedChatId(null)
  //           replace(
  //             {
  //               query: {
  //                 hash: undefined,
  //               },
  //             },
  //             undefined,
  //             {shallow: true},
  //           )
  //         }}
  //       />
  //     )}
  //     <Auth hide />
  //   </div>
  // )
})

export default ChatLayout
