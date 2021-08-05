import {FC, useState} from 'react'
import {parseCookies} from 'nookies'
import IcClear from 'icons/material/Clear.svg'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {setCookiesObject} from '../helpers'
import LinkWrapper from './Buttons/LinkWrapper'

const DevBanner: FC = () => {
  const state: SerializedCookiesState = parseCookies()
  const [hide, setHide] = useState(false)
  if (state.hideDevBanner || hide) return null
  return (
    <div className='flex flex-col flex justify-center items-center relative bg-black-e'>
      <h4 className='text-h-4 text-black-b font-bold m-auto pt-2'>
        We have updated our site
      </h4>
      <span className='text-body-2 text-black-c text-center my-2'>
        This version of the site is under development and some functions may be
        disabled or not work correctly.
      </span>
      <LinkWrapper
        href='oldsite.com'
        title='old site'
        className='text-body-2 text-brand-b1 pb-2'>
        Continue with old site
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
