import {FC, useState, useRef, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {useClickAway} from 'react-use'
import {Heart2, Logout, Message} from 'react-iconly'
import IcBurger from 'icons/material/Burger.svg'
import IcProfile from 'icons/material/Profile.svg'
import IcAds from 'icons/material/Ads.svg'
import IcCreate from 'icons/material/Create.svg'
import localforage from 'localforage'
import {SerializedCookiesState} from '../types'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {makeRequest} from '../api'
import LogoutButton from './Auth/LogoutButton'
import Button from './Buttons/Button'
import {destroyCookiesWrapper} from '../helpers'

interface Props {
  onLogin?: () => void
  hide?: boolean
}

const UserBurger: FC<Props> = observer(({onLogin, hide}) => {
  const {t} = useTranslation()
  const cookies: SerializedCookiesState = parseCookies()
  const {activeUserPage, setUser, user} = useGeneralStore()
  const [showPopup, setShowPopup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [active, setActive] = useState(false)
  const router = useRouter()
  const ref = useRef(null)
  useClickAway(ref, () => {
    if (!showLogout) setShowPopup(false)
  })
  const [showLogout, setShowLogout] = useState(false)
  const processUser = async (hash) => {
    const userData = await makeRequest({
      url: '/api/user-info',
      method: 'post',
      data: {hash},
    })
    if (userData.data?.status === 200) {
      setUser(userData.data?.result)
    } else {
      destroyCookiesWrapper('hash')
      destroyCookiesWrapper('promo')
      destroyCookiesWrapper('authType')
      destroyCookiesWrapper('aup')
      destroyCookiesWrapper('authNewRefreshToken')
      destroyCookiesWrapper('authNewToken')
      destroyCookiesWrapper('sessionId')
      localforage.clear()
      router.reload()
    }
  }
  useEffect(() => {
    if (cookies.hash) {
      processUser(cookies.hash)
    } else {
      setShowLogin(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.hash])

  if (hide) return null
  return (
    <div ref={ref}>
      {user ? (
        <div className='relative'>
          <Button
            onClick={() => {
              setShowPopup(!showPopup)
            }}
            id='user-menu-burger'>
            <IcBurger
              className={`${
                showPopup ? 'text-primary-500' : 'text-greyscale-900'
              } fill-current  hover:text-primary-500 h-6 w-6`}
            />
          </Button>
          {showPopup && (
            <div
              className='absolute right-0 top-14 bg-white shadow-2xl rounded-lg w-[320px] z-10'
              data-test-id='user-menu-body'>
              <div className='space-y-8 py-8'>
                <Button
                  className={`${
                    activeUserPage === 'adverts' || activeUserPage === null
                      ? 'text-primary-500'
                      : 'text-greyscale-900'
                  } px-8 hover:text-primary-500 w-full rounded-lg`}
                  onClick={() => {
                    router.push(`/user/${user.hash}`)
                    setShowPopup(false)
                    setActive(true)
                  }}>
                  <IcAds className='w-7 h-7 fill-current' />
                  <span className='w-full ml-4 text-left text-body-16 font-medium'>
                    {t('MY_ADVERTISIMENT')}
                  </span>
                </Button>
                <Button
                  className={`${
                    activeUserPage === 'favorites'
                      ? 'text-primary-500'
                      : 'text-greyscale-900'
                  } px-8 hover:text-primary-500 w-full rounded-lg`}
                  onClick={() => {
                    router.push(`/user/${user.hash}?page=favorites`)
                    setShowPopup(false)
                    setActive(true)
                  }}>
                  <Heart2 filled size={28} />
                  <span className='w-full ml-4 text-left text-body-16 font-medium'>
                    {t('FAVORITE')}
                  </span>
                </Button>
                <Button
                  className={`${
                    activeUserPage === 'drafts'
                      ? 'text-primary-500'
                      : 'text-greyscale-900'
                  } px-8 hover:text-primary-500 w-full rounded-lg`}
                  onClick={() => {
                    router.push(`/user/${user.hash}?page=drafts`)
                    setShowPopup(false)
                    setActive(true)
                  }}>
                  <IcCreate className='fill-current h-7 w-7' />
                  <span className='w-full ml-4 text-left text-body-16 font-medium'>
                    {t('DRAFTS')}
                  </span>
                </Button>
                <Button
                  className={`${
                    activeUserPage === 'chat'
                      ? 'text-primary-500'
                      : 'text-greyscale-900'
                  } px-8 hover:text-primary-500 w-full rounded-lg`}
                  onClick={() => {
                    router.push(`/user/${user.hash}?page=chat`)
                    setShowPopup(false)
                    setActive(true)
                  }}>
                  <Message filled size={28} />
                  <span className='w-full ml-4 text-left text-body-16 font-medium'>
                    {t('MESSAGES')}
                  </span>
                </Button>

                <LogoutButton
                  className='px-8 text-greyscale-500 hover:text-primary-500 w-full rounded-lg'
                  onClose={() => {
                    setShowPopup(false)
                    setShowLogout(false)
                  }}
                  onOpen={() => {
                    setShowLogout(true)
                  }}>
                  <Logout filled size={28} />
                  <span className='w-full ml-4 text-left text-body-16 font-medium'>
                    {t('EXIT')}
                  </span>
                </LogoutButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {showLogin && (
            <div>
              <Button className='flex flex-col h-10' onClick={onLogin}>
                <IcProfile className='h-6 w-6 mb-1' />
                <span className='text-body-12 text-greyscale-900 hidden l:block whitespace-nowrap'>
                  {t('LOG_IN_ICON')}
                </span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
})

export default UserBurger
