import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import IcLogin from 'icons/material/Login.svg'
import {UserModel} from 'front-api/src/models/index'
import {SerializedCookiesState} from '../types'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {makeRequest} from '../api'
import Button from './Buttons/Button'

interface Props {
  onLogin: () => void
}
const Auth: FC<Props> = observer(({onLogin}) => {
  const cookies: SerializedCookiesState = parseCookies()
  const {t} = useTranslation()
  // hack for triggering update
  const {trigger} = useGeneralStore()
  const [user, setUser] = useState<UserModel>()
  const processUser = async (hash) => {
    const userData = await makeRequest({
      url: '/api/user-info',
      method: 'post',
      data: {hash},
    })
    console.log('userData', userData)
    if (userData.data?.result) setUser(userData.data?.result)
  }
  useEffect(() => {
    if (cookies.hash) {
      processUser(cookies.hash)
    }
  }, [cookies.hash])
  return (
    <div className=''>
      {user ? (
        <span className='text-brand-b1 text-body-3 flex items-center'>
          {user.name}
        </span>
      ) : (
        <Button className='flex' onClick={onLogin}>
          <IcLogin className='fill-current text-brand-b1 mr-2 h-4 w-4' />
          <span className='text-body-3 text-brand-b1'>{t('LOGIN')}</span>
        </Button>
      )}
    </div>
  )
})
export default Auth
