import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import IcLogin from 'icons/material/Login.svg'
import {useRouter} from 'next/router'
import {useClickAway} from 'react-use'
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
            id='user-menu-button'>
            <UserAvatar url={user.imageUrl} size={10} name={user.name} />
          </Button>
          {showPopup && (
            <div
              className='absolute right-0 top-8 bg-white shadow-2xl rounded-lg w-40 overflow-hidden'
              data-test-id='user-menu-body'>
              {options.map(({title, onClick}) => (
                <Button
                  className='px-4 py-3 text-black-b hover:bg-brand-a2 w-full text-body-2'
                  onClick={() => {
                    onClick()
                    setShowPopup(false)
                  }}>
                  {title}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {showLogin && (
            <Button className='h-10 w-10 min-w-[40px] ' onClick={onLogin}>
              <IcProfile className='h-6 w-6' />
            </Button>
          )}
        </>
      )}
    </div>
  )
})
export default Auth
