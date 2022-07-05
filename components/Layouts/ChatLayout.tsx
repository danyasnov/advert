import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {SerializedCookiesState} from '../../types'
import {getRest} from '../../api'
import {mapCookies} from '../../helpers'
import {useGeneralStore} from '../../providers/RootStoreProvider'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()

  useEffect(() => {
    if (!user) return

    const init = async () => {
      const state: SerializedCookiesState = parseCookies()
      const storage = mapCookies(state)
      const restApi = getRest(storage)
      const {Chats, globalChatsStore} = await import('chats')
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
    }
    init()
  }, [user])

  return (
    <HeaderFooterWrapper>
      <div className=' py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12'>123</main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default ChatLayout
