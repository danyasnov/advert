import {FC, useEffect, useState} from 'react'
import {AddUser} from 'react-iconly'
import IcDeleteUserBlack from 'icons/material/DeleteUserBlack.svg'
import IcDeleteUserPurple from 'icons/material/DeleteUserPurple.svg'
import IcDeleteUserGrey from 'icons/material/DeleteUserGrey.svg'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

interface Props {
  isSubscribed: boolean
  ownerId: string
  type?: 'card' | 'profile' | 'profileSmall'
}

const SubscribeOnUser: FC<Props> = ({isSubscribed, ownerId, type = 'card'}) => {
  const {t} = useTranslation()
  const [localSubscribed, setLocalSubscribed] = useState(isSubscribed)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setLocalSubscribed(isSubscribed)
  }, [isSubscribed])

  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    setShow(cookies.hash && cookies.hash !== ownerId)
  }, [ownerId])

  if (!show) return null

  let body
  if (type === 'card') {
    body = localSubscribed ? (
      <div className='flex justify-between space-x-1.5 text-body-14'>
        <IcDeleteUserBlack className='fill-current text-primary-500 h-5 w-5' />
        <span className='text-greyscale-900 font-normal'>
          {t('UNSUBSCRIBE')}
        </span>
      </div>
    ) : (
      <div className='flex justify-between space-x-1.5 text-body-14 text-primary-500'>
        <AddUser size={20} filled />
        <span className='text-greyscale-900 font-normal'>{t('SUBSCRIBE')}</span>
      </div>
    )
  } else if (type === 'profile') {
    body = localSubscribed ? (
      <div className='flex justify-between space-x-1.5 text-body-14 text-primary-500'>
        <IcDeleteUserPurple className='fill-current text-primary-500 h-5 w-5' />
        <span className='font-normal'>{t('UNSUBSCRIBE')}</span>
      </div>
    ) : (
      <div className='flex justify-between space-x-1.5 text-body-14 text-primary-500'>
        <AddUser size={20} filled />
        <span className='text-body-14 font-normal'>{t('SUBSCRIBE')}</span>
      </div>
    )
  } else {
    body = localSubscribed ? (
      <div className='flex justify-between space-x-1.5 items-center text-body-14 text-greyscale-500'>
        <IcDeleteUserGrey className='fill-current h-4 w-4' />
        <span className='font-normal'>{t('UNSUBSCRIBE')}</span>
      </div>
    ) : (
      <div className='flex justify-between space-x-1.5 items-center text-body-14 text-greyscale-500'>
        <AddUser size={16} filled />
        <span className='text-body-14 font-normal'>{t('SUBSCRIBE')}</span>
      </div>
    )
  }

  return (
    <Button
      disabled={loading}
      onClick={(e) => {
        e.preventDefault()
        setLoading(true)
        makeRequest({
          url: '/api/subscribe-on-user',
          method: 'post',
          data: {
            userId: ownerId,
            isAlreadySubscribed: isSubscribed,
          },
        })
          .then(() => {
            setLocalSubscribed(!localSubscribed)
          })
          .finally(() => {
            setLoading(false)
          })
      }}>
      {body}
    </Button>
  )
}

export default SubscribeOnUser
