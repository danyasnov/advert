import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {Chats, globalChatsStore} from 'chats'
import {SerializedCookiesState} from '../types'
import Storage from '../stores/Storage'
import {getRest} from '../api'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {getStorageFromCookies} from '../helpers'

const ChatListener: FC = observer(() => {
  const {user} = useGeneralStore()
  const {t} = useTranslation()
  const state: SerializedCookiesState = parseCookies()

  useEffect(() => {
    if (!user || !state.authNewToken) return
    // const storage = new Storage({language: state.language})
    const storage = getStorageFromCookies()
    const restApi = getRest(storage, '/api')
    // const {Chats, globalChatsStore} = await import('chats')

    Chats.init({
      deps: {
        // @ts-ignore
        restApi,
        t,
        langProvider: () => 'en',
        ui: {showLoading: () => ({}), hideLoading: () => ({})},
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
          sendMedia: () => ({}),
          saveDisabledAutoTranslationChatIds: () => ({}),
          loadDisabledAutoTranslationChatIds: async () => new Set(),
        },
      },
      options: {
        isStaging: false,
        debug: true,
        connectionParams: async () => ({
          token: state.authNewToken,
          hash: state.hash,
          device_id: 'web',
          device_type: 3,
          device_model: 'web',
          os_version: 'web',
          install_id: 'web',
          timezone_offset: Math.floor(restApi.utils.timestamp()),
        }),
      },
    })
    globalChatsStore.init({
      id: user.hash,
      name: user.name,
      avatarSrc: user.imageUrl,
      updatedAt: 0,
      onlineLastTime: 0,
      online: user.isOnline,
      langCode: user.mainLanguage.isoCode,
    })
    const startConnection = async () => {
      const error = await globalChatsStore.startConnection()
    }
    startConnection()
    return () => {
      globalChatsStore.closeConnection()
    }
  }, [user, state.authNewToken])

  return null
})

export default ChatListener
