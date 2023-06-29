import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import {AdvertiseDetail} from 'front-api'
import {globalChatsStore} from 'chats'
import SecondaryButton from './SecondaryButton'
import {SerializedCookiesState} from '../../types'
import {useModalsStore} from '../../providers/RootStoreProvider'

interface Props {
  product: AdvertiseDetail
}
const ChatButton: FC<Props> = observer(({product}) => {
  const {t} = useTranslation()
  const {push} = useRouter()
  const {owner, advert} = product
  const {setModal} = useModalsStore()

  return (
    <div className='w-full mb-4'>
      <SecondaryButton
        id='chat'
        className='w-full h-[52px] text-body-16'
        onClick={async () => {
          const state: SerializedCookiesState = parseCookies()
          if (!state.hash) {
            setModal('LOGIN')
          } else {
            const chat = await globalChatsStore.createChat({
              productHash: advert.hash,
              userHash: owner.hash,
            })
            push(`/chat?chatId=${chat.id}`)
          }
        }}>
        {t('SEND_A_MESSAGE')}
      </SecondaryButton>
    </div>
  )
})
export default ChatButton
