import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {SerializedCookiesState} from '../../types'
import {useGeneralStore} from '../../providers/RootStoreProvider'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()

  useEffect(() => {
    // debugger
    // if (!user) return

    const init = async () => {
      const state: SerializedCookiesState = parseCookies()
      // const storage = mapCookies(state)
      // const restApi = getRest(storage)
      const socket = new WebSocket('ws://ao-dev.venera.city:5002/ws')
      socket.addEventListener('error', (event) => {
        console.log('event', event)
      })
      // ws.on('open', function open() {
      //   const array = new Float32Array(5)
      //
      //   for (let i = 0; i < array.length; ++i) {
      //     array[i] = i / 2
      //   }
      //
      //   ws.send(array)
      // })

      // const socket = io('wss://ao-dev.venera.city:5002/ws')
      // socket.on('connect', () => {
      //   console.log(socket.id)
      // })
      // socket.on('disconnect', () => {
      //   console.log(socket.id)
      // })
      // socket.on('connect_error', (err) => {
      //   console.log(err)
      // })
    }
    init()
  }, [user])

  return null

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
