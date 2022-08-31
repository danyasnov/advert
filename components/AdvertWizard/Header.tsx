import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useWindowSize} from 'react-use'
import Logo from '../Logo'
import UserAvatar from '../UserAvatar'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import Auth from '../Auth'

const Header: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()
  const {width} = useWindowSize()

  return (
    <header className='hidden s:block relative z-10 header-width mx-auto py-8'>
      <div className='w-full l:w-1208px flex items-center justify-between'>
        <div className='flex items-center'>
          <Logo />
          <span className='ml-6 text-h-4 font-bold'>{t('NEW_AD')}</span>
        </div>
        <div className='flex items-center px-6'>
          <Auth />
        </div>
      </div>
    </header>
  )
})

export default Header
