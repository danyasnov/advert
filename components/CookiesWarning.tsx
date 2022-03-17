import {FC, useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {setCookiesObject} from '../helpers'
import {useGeneralStore} from '../providers/RootStoreProvider'

const DevBanner: FC = () => {
  const {toggleCookiesWarnVisibility} = useGeneralStore()
  const {t} = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShow(state.cookieAccepted !== 'true')
  }, [])
  if (!show) return null
  return (
    <div className='fixed inset-x-0 bottom-0 bg-shadow-overlay text-white flex flex-col s:flex-row justify-between px-4 s:px-8 m:px-10 items-center py-2 z-10'>
      <h5 className='text-h-5 font-bold mb-2 s:mb-0'>{t('COOKIES_WARNING')}</h5>
      <Button
        className='text-body-3 p-2 bg-brand-a1 rounded'
        onClick={() => {
          toggleCookiesWarnVisibility()
          setCookiesObject({cookieAccepted: true})
          setShow(false)
        }}>
        {t('ACCEPT_COOKIES')}
      </Button>
    </div>
  )
}
export default DevBanner
