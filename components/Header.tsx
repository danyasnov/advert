import {FC, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
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
import LoginModal from './Auth/LoginModal'
import Auth from './Auth'
import {useGeneralStore} from '../providers/RootStoreProvider'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import PrimaryButton from './Buttons/PrimaryButton'
import {makeRequest} from '../api'
import LinkButton from './Buttons/LinkButton'

export const languageOptions = [
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

export const withLangIcons = (opts) =>
  opts.map((o) => ({
    ...o,
    icon: (
      <ImageWrapper
        type={`/img/flags/${o.value}.png`}
        alt={o.value}
        width={16}
        height={16}
      />
    ),
  }))

const Header: FC = observer(() => {
  const {reload, push} = useRouter()
  const {t} = useTranslation()
  const [lang, setLang] = useState<string>()
  const languages = useRef(withLangIcons(languageOptions))
  const {showLogin, setShowLogin, user} = useGeneralStore()
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setLang(state.language)
  }, [])
  useDisableBodyScroll(showLogin)

  return (
    <header className='flex s:justify-center relative shadow-lg z-10'>
      <div className='header-width'>
        <div className='flex s:justify-between px-4 py-2 border-b border-shadow-b s:px-0'>
          <div className='hidden s:flex space-x-4'>
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('FOR_BUSINESS')} */}
            {/*  /> */}
            <LinkWrapper
              className='text-brand-b1 text-body-3'
              href='/merchant'
              title={t('SHOPS')}>
              {t('SHOPS')}
            </LinkWrapper>
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('APPLICATION_HELP')} */}
            {/*  /> */}
          </div>
          <div className='flex justify-end w-full s:w-auto space-x-4 items-center'>
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
                  reload()
                }}
                value={languages.current.find(({value}) => value === lang)}
                options={languages.current as SelectItem[]}
                isSearchable={false}
                placeholder={t('LANGUAGES')}
              />
            </div>
            <Auth onLogin={() => setShowLogin(true)} />
          </div>
        </div>
        <div className='flex py-2 mx-4 space-x-4 s:py-4 s:mx-0 s:space-x-6 m:space-x-8'>
          <Logo />
          <div className='flex space-x-4 w-full'>
            <CategoriesSelector />
            <Search />
          </div>
          <PrimaryButton
            className='hidden s:flex h-10 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap'
            onClick={async () => {
              if (!user) {
                return setShowLogin(true)
              }
              return push(`/advert/create`)
            }}>
            <span className='capitalize-first text-white'>{t('NEW_AD')}</span>
          </PrimaryButton>
        </div>
      </div>
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </header>
  )
})

export default Header
