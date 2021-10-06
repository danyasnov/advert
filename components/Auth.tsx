import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import IcLogin from 'icons/material/Login.svg'
import {useRouter} from 'next/router'
import {useClickAway} from 'react-use'
import {SerializedCookiesState} from '../types'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {makeRequest} from '../api'
import Button from './Buttons/Button'
import UserAvatar from './UserAvatar'
import {destroyCookiesWrapper} from '../helpers'

interface Props {
  onLogin: () => void
}
const Auth: FC<Props> = observer(({onLogin}) => {
  const cookies: SerializedCookiesState = parseCookies()
  const router = useRouter()
  const ref = useRef(null)
  const [showLogin, setShowLogin] = useState(false)
  const {t} = useTranslation()
  const {setUser, user} = useGeneralStore()
  const [showPopup, setShowPopup] = useState(false)
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
        router.reload()
      },
    },
  ]
  return (
    <>
      {user ? (
        <div className='relative'>
          <Button onClick={() => setShowPopup(!showPopup)}>
            <UserAvatar url={user.imageUrl} size={4} name={user.name} />
            <span className='ml-2 text-brand-b1 text-body-3 flex items-center'>
              {user.name}
            </span>
          </Button>
          {showPopup && (
            <div
              className='absolute right-0 top-8 bg-white shadow-2xl rounded-lg w-40 overflow-hidden'
              ref={ref}>
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
            <Button className='flex' onClick={onLogin}>
              <IcLogin className='fill-current text-brand-b1 mr-2 h-4 w-4' />
              <span className='text-body-3 text-brand-b1'>{t('LOGIN')}</span>
            </Button>
          )}
        </>
      )}
    </>
  )
})
export default Auth
