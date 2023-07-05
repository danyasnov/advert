import {FC, useEffect, useState} from 'react'
import {ChatData} from 'chats'
import {useTranslation} from 'next-i18next'
import SupportInterlocutor from 'icons/SupportInterlocutor.svg'
import {observer} from 'mobx-react-lite'
import UserAvatar from '../UserAvatar'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import CallButton from '../Buttons/CallButton'
import {makeRequest} from '../../api'

interface Props {
  chat: ChatData
}
const Interlocutor: FC<Props> = observer(({chat}) => {
  const {t} = useTranslation()
  const {interlocutor, product} = chat
  const {user} = useGeneralStore()
  const [isMyAdvert, setIsMyAdvert] = useState(false)
  if (chat.interlocutor.id === 'support') {
    return (
      <div className='self-start mb-6 flex w-full'>
        <div className='w-12 h-12 mr-4 shrink-0'>
          <SupportInterlocutor />
        </div>
        <div className='flex flex-col text-left w-full justify-center'>
          <span className='text-body-16 font-semibold text-greyscale-900 line-clamp-1 w-full'>
            {interlocutor.name}
          </span>
          <span className='text-body-14 font-semibold text-green'>
            {t('ONLINE')}
          </span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    makeRequest({
      url: '/api/product',
      method: 'post',
      data: {hash: product.id},
    }).then((productData) => {
      setIsMyAdvert(productData.data.result?.owner.hash === user.hash)
    })
  }, [])

  return (
    <CallButton
      className='self-start mb-6 flex w-full'
      hideNumber={isMyAdvert}
      productHash={product.id}
      ownerHash={interlocutor.id}>
      <div className='w-10 h-10 rounded-full bg-gray-300 mr-4'>
        <UserAvatar
          size={10}
          name={interlocutor.name}
          url={interlocutor.avatarSrc}
        />
      </div>
      <div className='flex flex-col text-left w-full'>
        <span className='text-body-16 font-semibold text-greyscale-900 line-clamp-1 w-full'>
          {interlocutor.name}
        </span>
        <span
          className={`text-body-14 font-semibold ${
            interlocutor.online || chat.interlocutor.id === 'support'
              ? 'text-green'
              : 'text-greyscale-600'
          }`}>
          {interlocutor.online || chat.interlocutor.id === 'support'
            ? t('ONLINE')
            : t('OFFLINE')}
        </span>
      </div>
    </CallButton>
  )
})
export default Interlocutor
