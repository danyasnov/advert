import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import {Plus} from 'react-iconly'
import IcCurvedPlus from 'icons/material/CurvedPlus.svg'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector/index'
import LinkWrapper from './Buttons/LinkWrapper'
import LoginModal from './Auth/Login/LoginModal'
import Auth from './Auth'
import {useGeneralStore} from '../providers/RootStoreProvider'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import PrimaryButton from './Buttons/PrimaryButton'
import LanguageSelect from './LanguageSelect'
import Button from './Buttons/Button'

const Header: FC = observer(() => {
  const {push} = useRouter()
  const {t} = useTranslation()
  const {showLogin, setShowLogin, user} = useGeneralStore()
  useDisableBodyScroll(showLogin)

  return (
    <header className='flex s:justify-center relative shadow-lg z-10'>
      <div className='header-width'>
        <div className='flex s:justify-between px-4 py-2 s:px-0 mb-2'>
          <div className='flex  w-full s:w-auto space-x-4 items-center'>
            {/* <LinkButton */}
            {/*  onClick={notImplementedAlert} */}
            {/*  label={t('WALLET')} */}
            {/*  className='mr-auto s:ml-4'> */}
            {/*  <IcWallet className='fill-current text-brand-b1 mr-2 h-4 w-4' /> */}
            {/* </LinkButton> */}
            <LanguageSelect />
          </div>
          <div className='flex space-x-4'>
            {/*  <LinkButton */}
            {/*    onClick={notImplementedAlert} */}
            {/*    label={t('FOR_BUSINESS')} */}
            {/*  /> */}
            {/* <LinkWrapper */}
            {/*  className='text-brand-b1 text-body-3 whitespace-nowrap flex items-center' */}
            {/*  href='/merchant' */}
            {/*  title={t('SHOPS')}> */}
            {/*  {t('SHOPS')} */}
            {/* </LinkWrapper> */}
            {/* <LinkWrapper */}
            {/*  className='text-brand-b1 text-body-3 whitespace-nowrap flex items-center hidden s:block' */}
            {/*  href='/safety' */}
            {/*  title={t('SAFETY')}> */}
            {/*  {t('SAFETY')} */}
            {/* </LinkWrapper> */}
          </div>
        </div>
        <div className='flex py-2 mx-4 space-x-4 s:space-x-6 m:space-x-8'>
          <Logo />
          <div className='flex w-full'>
            <div className='-mr-3 z-10'>
              <CategoriesSelector />
            </div>
            <Search />
          </div>
          <Button
            className='h-10 w-10 min-w-[40px] rounded-full bg-primary-500 text-white'
            onClick={async () => {
              if (!user) {
                return setShowLogin(true)
              }
              return push(`/advert/create`)
            }}>
            <IcCurvedPlus />
          </Button>
          <Auth onLogin={() => setShowLogin(true)} />
        </div>
      </div>
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </header>
  )
})

export default Header
