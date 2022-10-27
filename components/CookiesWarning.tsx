import {FC, useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {setCookiesObject} from '../helpers'
import {useGeneralStore} from '../providers/RootStoreProvider'
import PrimaryButton from './Buttons/PrimaryButton'

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
    <div className='fixed inset-x-0 bottom-0 bg-dark-2/90 text-white py-4 z-10'>
      <div className='header-width flex flex-col s:flex-row s:justify-between s:items-center px-4 s:px-0 s:mx-auto'>
        <span className='text-body-16 font-normal mb-8 s:mb-0 s:w-9/12'>
          {t('COOKIES_WARNING')}
        </span>
        <PrimaryButton
          className='s:w-2/12'
          onClick={() => {
            toggleCookiesWarnVisibility()
            setCookiesObject({cookieAccepted: true})
            setShow(false)
          }}>
          {t('ACCEPT_COOKIES')}
        </PrimaryButton>
      </div>
    </div>
  )
}
export default DevBanner
