import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import IcLogin from 'icons/material/Login.svg'
import {useRouter} from 'next/router'
import {useClickAway, useWindowSize} from 'react-use'
import localforage from 'localforage'
import IcProfile from 'icons/material/Profile.svg'
import {SerializedCookiesState} from '../types'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {makeRequest} from '../api'
import Button from './Buttons/Button'
import UserAvatar from './UserAvatar'
import {destroyCookiesWrapper} from '../helpers'

interface Props {
  onLogin?: () => void
  hide?: boolean
}
const Auth: FC<Props> = observer(({onLogin, hide}) => {
  const cookies: SerializedCookiesState = parseCookies()
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const {t} = useTranslation()
  const {setUser, user} = useGeneralStore()
  const [showPopup, setShowPopup] = useState(false)
  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })
  const {width} = useWindowSize()
  const processUser = async (hash) => {
    const userData = await makeRequest({
      url: '/api/user-info',
      method: 'post',
      data: {hash},
    })
    if (userData.data?.result) setUser(userData.data?.result)
  }
  useEffect(() => {
    if (cookies.hash) {
      processUser(cookies.hash)
    } else {
      setShowLogin(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.hash])

  const options = [
    {
      title: t('MY_PROFILE'),
      onClick: () => {
        router.push(`/user/${user.hash}`)
      },
    },
    {
      title: t('EXIT'),
      onClick: () => {
        destroyCookiesWrapper('hash')
        destroyCookiesWrapper('promo')
        destroyCookiesWrapper('authType')
        destroyCookiesWrapper('aup')
        destroyCookiesWrapper('authNewRefreshToken')
        destroyCookiesWrapper('authNewToken')
        localforage.clear()
        router.reload()
      },
    },
  ]
  if (hide) return null
  return (
    <div ref={ref}>
      {user ? (
        <div className='relative'>
          <Button
            onClick={() => setShowPopup(!showPopup)}
            className='flex flex-col'
            id='user-menu-button'>
            <UserAvatar
              url={user.imageUrl}
              size={width < 1440 ? 10 : 6}
              name={user.name}
            />
            <span className='text-body-12 text-greyscale-900 mt-1 hidden l:block whitespace-nowrap'>
              {t('MY_PROFILE')}
            </span>
          </Button>
          {showPopup && (
            <div
              className='absolute right-0 top-14 bg-white shadow-2xl rounded-lg w-40  '
              data-test-id='user-menu-body'>
              <div className='location-popup-arrow-top'>
                {options.map(({title, onClick}) => (
                  <Button
                    className='px-4 py-3 text-black-b hover:bg-brand-a2 w-full text-body-14 rounded-lg'
                    onClick={() => {
                      onClick()
                      setShowPopup(false)
                    }}>
                    {title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {showLogin && (
            <Button className='flex flex-col' onClick={onLogin}>
              <IcProfile className='h-6 w-6 mb-1' />
              <span className='text-body-12 text-greyscale-900 hidden l:block'>
                {t('LOG_IN_ICON')}
              </span>
            </Button>
          )}
        </>
      )}
    </div>
  )
})
export default Auth
