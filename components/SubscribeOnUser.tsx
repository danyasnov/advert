import {FC, useEffect, useState} from 'react'
import {AddUser} from 'react-iconly'
import IcDeleteUserBlack from 'icons/material/DeleteUserBlack.svg'
import IcDeleteUserPurple from 'icons/material/DeleteUserPurple.svg'
import IcDeleteUserGrey from 'icons/material/DeleteUserGrey.svg'
import IcDeleteUserWhite from 'icons/material/DeleteUserWhite.svg'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

interface Props {
  isSubscribed: boolean
  ownerId: string
  type?: 'card' | 'profile' | 'profileSmall' | 'list'
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
  } else if (type === 'list') {
    body = localSubscribed ? (
      <div className='flex group justify-between space-x-1.5 text-body-14 bg-white py-1.5 px-2 text-primary-500 rounded-full hover:bg-primary-500'>
        <IcDeleteUserPurple className='fill-current group-hover:hidden h-5 w-5' />
        <IcDeleteUserWhite className='hidden fill-current group-hover:block h-5 w-5' />
        <span className='font-normal text-primary-500 group-hover:text-white'>
          {t('UNSUBSCRIBE')}
        </span>
      </div>
    ) : (
      <div className='flex group justify-between space-x-1.5 text-body-14 bg-white py-1.5 px-2 text-primary-500 rounded-full hover:bg-primary-500'>
        <div className='group-hover:text-white'>
          <AddUser size={20} filled />
        </div>
        <span className='font-normal text-primary-500 group-hover:text-white'>
          {t('SUBSCRIBE')}
        </span>
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
