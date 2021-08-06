import {FC, useState} from 'react'
import {parseCookies} from 'nookies'
import IcClear from 'icons/material/Clear.svg'
import {useTranslation} from 'next-i18next'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {setCookiesObject} from '../helpers'
import LinkWrapper from './Buttons/LinkWrapper'

const DevBanner: FC = () => {
  const state: SerializedCookiesState = parseCookies()
  const {t} = useTranslation()
  const [hide, setHide] = useState(false)
  if (state.hideDevBanner || hide) return null
  return (
    <div className='flex flex-col flex justify-center items-center relative bg-black-e'>
      <h4 className='text-h-4 text-black-b font-bold m-auto pt-2'>
        {t('BANNER_HEADER_OLD_SITE')}
      </h4>
      <span className='text-body-2 text-black-c text-center my-2'>
        {t('BANNER_TEXT_OLD_SITE')}
      </span>
      <LinkWrapper
        href='old.adverto.sale'
        title='old site'
        className='text-body-2 text-brand-b1 pb-2'>
        {t('BANNER_LINK_OLD_SITE')}
      </LinkWrapper>
      <Button
        className='absolute top-0 right-0 pt-2 pr-2'
        onClick={() => {
          setCookiesObject({hideDevBanner: true})
          setHide(true)
        }}>
        <IcClear className='fill-current text-black-d h-6 w-6' />
      </Button>
    </div>
  )
}
export default DevBanner
