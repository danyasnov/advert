import {FC, useState} from 'react'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {setCookiesObject} from '../helpers'

const DevBanner: FC = () => {
  const state: SerializedCookiesState = parseCookies()
  const {t} = useTranslation()
  const [hide, setHide] = useState(false)
  if (state.cookieAccepted || hide) return null
  return (
    <div className='fixed inset-x-0 bottom-0 bg-shadow-overlay text-white flex h-16 justify-between px-12 items-center'>
      <h5 className='text-h-5 font-bold'>{t('COOKIES_WARNING')}</h5>
      <Button
        className='text-body-3 p-2 bg-brand-a1 rounded'
        onClick={() => {
          setCookiesObject({cookieAccepted: true})
          setHide(true)
        }}>
        {t('ACCEPT_COOKIES')}
      </Button>
    </div>
  )
}
export default DevBanner
