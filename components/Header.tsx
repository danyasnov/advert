import {FC, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcWallet from 'icons/material/Wallet.svg'
import IcLogin from 'icons/material/Login.svg'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import Button from './Buttons/Button'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector/index'
import {setCookiesObject} from '../helpers'
import LinkSelect from './Selects/LinkSelect'
import ImageWrapper from './ImageWrapper'
import {SelectItem} from './Selects/Select'
import {SerializedCookiesState} from '../types'
import LinkWrapper from './Buttons/LinkWrapper'

const options = [
  {
    value: 'el',
    label: 'Eλληνική',
  },
  {value: 'en', label: 'English'},
  {value: 'uk', label: 'Українська'},
  {value: 'ru', label: 'Русский'},
  {value: 'tr', label: 'Türk'},
  {value: 'ro', label: 'Română'},
]

const withIcons = (opts) =>
  opts.map((o) => ({
    ...o,
    icon: (
      <ImageWrapper
        type={`https://adverto.sale/img/flags/${o.value}.png`}
        alt={o.value}
        width={16}
        height={16}
      />
    ),
  }))

const Header: FC = () => {
  const router = useRouter()
  const {t} = useTranslation()
  const [lang, setLang] = useState<string>()
  const languages = useRef(withIcons(options))
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setLang(state.language)
  }, [])

  return (
    <header className='flex s:justify-center relative shadow-lg'>
      <div className='w-full header-width'>
        <div className='flex s:justify-between px-4 py-2 border-b border-shadow-b s:px-0'>
          <div className='hidden s:flex space-x-4'>
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('FOR_BUSINESS')} */}
            {/*  /> */}
            {/*  <LinkButton onClick={notImplementedAlert} label={t('SHOPS')} /> */}
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('APPLICATION_HELP')} */}
            {/*  /> */}
          </div>
          <div className='flex justify-end w-full s:w-auto space-x-4'>
            {/* <LinkButton */}
            {/*  onClick={notImplementedAlert} */}
            {/*  label={t('WALLET')} */}
            {/*  className='mr-auto s:ml-4'> */}
            {/*  <IcWallet className='fill-current text-brand-b1 mr-2 h-4 w-4' /> */}
            {/* </LinkButton> */}
            <div className='h-4 w-32'>
              <LinkSelect
                id='language-select'
                onChange={({value}) => {
                  setCookiesObject({language: value as string})
                  router.reload()
                }}
                value={languages.current.find(({value}) => value === lang)}
                options={languages.current as SelectItem[]}
                isSearchable={false}
                placeholder={t('LANGUAGES')}
              />
            </div>
            <LinkWrapper
              href='https://old.adverto.com'
              title={t('LOGIN')}
              target='_blank'
              className='flex'>
              <IcLogin className='fill-current text-brand-b1 mr-2 h-4 w-4' />
              <span className='text-body-3 text-brand-b1'>{t('LOGIN')}</span>
            </LinkWrapper>
          </div>
        </div>
        <div className='flex py-2 mx-4 space-x-4 s:py-4 s:mx-0 s:space-x-6 m:space-x-8'>
          <Logo />
          <div className='flex space-x-4 w-full'>
            <CategoriesSelector />
            <Search />
          </div>
          {/* <Button */}
          {/*  className='hidden s:flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap' */}
          {/*  onClick={notImplementedAlert}> */}
          {/*  <span className='capitalize-first'>{t('NEW_AD')}</span> */}
          {/* </Button> */}
        </div>
      </div>
    </header>
  )
}

export default Header
