import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {Chats, globalChatsStore} from 'chats'
import {SerializedCookiesState} from '../types'
import Storage from '../stores/Storage'
import {getRest} from '../api'
import {useGeneralStore} from '../providers/RootStoreProvider'

const ChatListener: FC = observer(() => {
  const {user} = useGeneralStore()
  const {t} = useTranslation()
  const state: SerializedCookiesState = parseCookies()

  useEffect(async () => {
    if (!user || !state.authNewToken) return
    const storage = new Storage(state)
    const restApi = getRest(storage)
    // const {Chats, globalChatsStore} = await import('chats')

    Chats.init({
      deps: {
        restApi,
        t,
        langProvider: () => 'en',
        ui: {showLoading: () => {}, hideLoading: () => {}},
        notifier: {
          showNotifierSuccess: (message) => {
            console.log({message})
          },
          showNotifierError: (message) => {
            console.log({message})
          },
        },
        system: {
          mediaPathMapper: () => '',
          sendMedia: () => {},
          saveDisabledAutoTranslationChatIds: () => {},
          loadDisabledAutoTranslationChatIds: async () => {},
        },
      },
      options: {
        isStaging: false,
        debug: true,
        connectionParams: async () => ({
          token: state.authNewToken,
          hash: state.hash,
          device_id: 'web',
          device_type: 1,
          device_model: 'web',
          os_version: 'web',
          install_id: 'web',
          // timezone_offset: 0,
          timezone_offset: Math.floor(restApi.utils.timestamp()),
        }),
        //   {
        //   hash: hash,
        //   secur: accessToken,
        //   timezone_offset: globalRestApi.utils.timestamp(),
        // },
        // chatsEndpointOverrides: asyncStorage.stand?.chatApiOverride,
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
  }, [user, state.authNewToken])

  return null
})

export default ChatListener
