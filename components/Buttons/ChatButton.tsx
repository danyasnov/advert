import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import {AdvertiseDetail} from 'front-api'
import {globalChatsStore} from 'chats'
import LinkWrapper from './LinkWrapper'
import SecondaryButton from './SecondaryButton'
import {SerializedCookiesState} from '../../types'
import {useGeneralStore} from '../../providers/RootStoreProvider'

interface Props {
  product: AdvertiseDetail
}
const ChatButton: FC<Props> = observer(({product}) => {
  const {t} = useTranslation()
  const {push} = useRouter()
  const {owner, advert} = product

  const {user} = useGeneralStore()
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShowChat(!!state.hash)
  }, [])
  return (
    <div className='w-full'>
      {showChat && (
        <SecondaryButton
          id='chat'
          className='w-full h-15'
          onClick={() => {
            globalChatsStore.createChat({
              productHash: advert.hash,
              userHash: owner.hash,
            })
            push(`/user/${user.hash}`)
          }}>
          {t('SEND_A_MESSAGE')}
        </SecondaryButton>
      )}
    </div>
  )
})
export default ChatButton
