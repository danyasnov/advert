import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector/index'
import LinkWrapper from './Buttons/LinkWrapper'
import LoginModal from './Auth/LoginModal'
import Auth from './Auth'
import {useGeneralStore} from '../providers/RootStoreProvider'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import PrimaryButton from './Buttons/PrimaryButton'
import LanguageSelect from './LanguageSelect'

const Header: FC = observer(() => {
  const {push} = useRouter()
  const {t} = useTranslation()
  const {showLogin, setShowLogin, user} = useGeneralStore()
  useDisableBodyScroll(showLogin)

  return (
    <header className='flex s:justify-center relative shadow-lg z-10'>
      <div className='header-width'>
        <div className='flex s:justify-between px-4 py-2 border-b border-shadow-b s:px-0'>
          <div className='flex space-x-4'>
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('FOR_BUSINESS')} */}
            {/*  /> */}
            <LinkWrapper
              className='text-brand-b1 text-body-3 whitespace-nowrap flex items-center'
              href='/merchant'
              title={t('SHOPS')}>
              {t('SHOPS')}
            </LinkWrapper>
            <LinkWrapper
              className='text-brand-b1 text-body-3 whitespace-nowrap flex items-center'
              href='/safety'
              title={t('SAFETY')}>
              {t('SAFETY')}
            </LinkWrapper>
          </div>
          <div className='flex justify-end w-full s:w-auto space-x-4 items-center'>
            {/* <LinkButton */}
            {/*  onClick={notImplementedAlert} */}
            {/*  label={t('WALLET')} */}
            {/*  className='mr-auto s:ml-4'> */}
            {/*  <IcWallet className='fill-current text-brand-b1 mr-2 h-4 w-4' /> */}
            {/* </LinkButton> */}
            <LanguageSelect />
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
