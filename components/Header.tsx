import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import IcCurvedPlus from 'icons/material/CurvedPlus.svg'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector/index'
import Auth from './Auth'
import {useGeneralStore, useModalsStore} from '../providers/RootStoreProvider'
import LanguageSelect from './LanguageSelect'
import Button from './Buttons/Button'
import {handleMetrics} from '../helpers'
import BusinessButton from './BusinessButton'
import SafetyButton from './SafetyButton'

const Header: FC = observer(() => {
  const {push} = useRouter()
  const {setModal} = useModalsStore()
  const {t} = useTranslation()
  const {user} = useGeneralStore()

  return (
    <header className='flex s:justify-center relative z-10'>
      <div className='header-width'>
        <div className='flex justify-between ml-4 s:ml-0 mt-4'>
          <Logo />
          <div className='hidden s:flex items-center space-x-5 '>
            <BusinessButton />
            <SafetyButton />
            <LanguageSelect />
          </div>
        </div>
        <div className='flex s:hidden items-center ml-4 mt-6 space-x-5'>
          <BusinessButton />
          <SafetyButton />
          <LanguageSelect />
        </div>
        <div className='flex pt-5 pb-5 px-4 s:px-0 space-x-4 s:space-x-6 m:space-x-8'>
          <div id='header-search' className='flex w-full'>
            <div className='-mr-3 z-10'>
              <CategoriesSelector />
            </div>
            <Search />
          </div>
          <Button
            className='h-10 w-10 min-w-[40px] m:min-w-fit rounded-full bg-primary-500 text-white'
            onClick={async () => {
              handleMetrics('click_addNew_advt')
              if (!user) {
                setModal('LOGIN')
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
          <Auth
            onLogin={() => {
              setModal('LOGIN')
              handleMetrics('clickLogin')
            }}
          />
        </div>
      </div>
    </header>
  )
})

export default Header
