import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import IcCurvedPlus from 'icons/material/CurvedPlus.svg'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector/index'
import LoginModal from './Auth/Login/LoginModal'
import Auth from './Auth'
import {useGeneralStore} from '../providers/RootStoreProvider'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import LanguageSelect from './LanguageSelect'
import Button from './Buttons/Button'
import BusinessButton from './BusinessButton'

const Header: FC = observer(() => {
  const {push} = useRouter()
  const {t} = useTranslation()
  const {showLogin, setShowLogin, user} = useGeneralStore()
  useDisableBodyScroll(showLogin)

  return (
    <header className='flex s:justify-center relative z-10'>
      <div className='header-width'>
        <div className='flex justify-start pl-4 s:pl-0 py-2 mb-2'>
          <div className='flex items-center'>
            <LanguageSelect />
          </div>
          <div className='flex items-center'>
            <BusinessButton />
          </div>
        </div>
        <div className='flex pt-2 pb-5 px-4 s:px-0 space-x-4 s:space-x-6 m:space-x-8'>
          <Logo />
          <div className='flex w-full'>
            <div className='-mr-3 z-10'>
              <CategoriesSelector />
            </div>
            <Search />
          </div>
          <Button
            className='h-10 w-10 min-w-[40px] m:min-w-fit rounded-full bg-primary-500 text-white'
            onClick={async () => {
              if (!user) {
                return setShowLogin(true)
              }
              return push(`/advert/create`)
            }}>
            <div className='block m:hidden text-white'>
              <IcCurvedPlus className='text-white fill-current w-7 h-7' />
            </div>
            <div className='hidden m:block'>
              <span className='text-body-14 px-4' data-test-id='header-new-ad'>
                {t('NEW_AD')}
              </span>
            </div>
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
