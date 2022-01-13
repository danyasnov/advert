import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {WebSocketConnectionUser} from 'chats'
import {toast} from 'react-toastify'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {SerializedCookiesState} from '../../types'
import Storage from '../../stores/Storage'
import {getRest} from '../../api'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {query} = useRouter()
  useEffect(() => {
    const init = async () => {
      const state: SerializedCookiesState = parseCookies()
      // @ts-ignore
      const storage = new Storage(state)
      const restApi = getRest(storage)
      // console.log('typeof window', typeof window)
      const {Chats, globalChatsStore} = await import('chats')
      Chats.init({
        deps: {
          restApi,
          t,
          langProvider: () => state.language,
          ui: {
            showLoading: () => console.log('showLoading'),
            hideLoading: () => console.log('hideLoading'),
          },
          notifier: {
            showNotifierSuccess: (message) => toast.success(message),
            showNotifierError: (message) => toast.error(message),
          },
          system: {
            mediaPathMapper: () => '',
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            loadDisabledAutoTranslationChatIds: () => {},
            // sendMediaMobile: async (endpoint, partName, path, params) => {
            //   return ''
            // },
          },
        },
        options: {
          isStaging: false,
          connectionParams: async (): Promise<
            WebSocketConnectionUser | undefined
          > => {
            const {hash} = state
            if (!hash) return undefined
            return {
              device_id: 'web',
              device_model: 'web',
              device_type: 'web',
              hash,
              secur: restApi.createChatSecure(),
              install_id: '',
              os_version: 'web',
              timezone_offset: restApi.utils.timestamp(),
            }
          },
        },
      })
      const error = await globalChatsStore.startConnection()
      console.log(error)
    }
    init()
  }, [])

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
