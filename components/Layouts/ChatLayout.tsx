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
  // const requestsRef = useRef<Record<string, boolean>>({})
  console.log('user', toJS(user))

  useEffect(() => {
    if (!user) return
    const state: SerializedCookiesState = parseCookies()
    const socket = new WebSocket('wss://backend.venera.city/ws/')

    const send = (method, params = {}) => {
      socket.send(
        JSON.stringify({
          method,
          params,
          id: method,
        }),
      )
    }

    socket.addEventListener('message', (event) => {
      console.log('message', event, JSON.parse(event.data))
      const response = JSON.parse(event.data)
      if (response.id === 'login') {
        send('chat_list')
      }
      if (response.id === 'chat') {
      }
    })
    socket.addEventListener('open', () => {
      pingPongRef.current = setInterval(() => {
        send('ping')
      }, 5000)
      send('login', {
        token: state.authNewToken,
        device_id: 'web',
        device_type: 1,
        device_model: 'web',
        os_version: 'web',
        install_id: 'web',
        timezone_offset: 0,
      })
    })
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
