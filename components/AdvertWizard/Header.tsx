import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import Logo from '../Logo'
import UserAvatar from '../UserAvatar'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import Auth from '../Auth'

const Header: FC = observer(() => {
  const {t} = useTranslation()
  const {user} = useGeneralStore()
  return (
    <header className='s:flex justify-around relative shadow-lg z-10 py-5 px-8 m:px-10 l:px-29 hidden'>
      <div className='w-full l:w-1208px flex items-center justify-between'>
        <div className='flex items-center'>
          <Logo />
          <h1 className='ml-8 nc-title font-semibold text-h-5 s:text-h-3'>
            {t('NEW_AD')}
          </h1>
        </div>
        <div className='flex items-center space-x-6 hidden s:flex'>
          {/* <IcNotificationsNone className='fill-current h-6 w-6 text-black-c' /> */}
          {/* <IcHelpOutline className='fill-current h-6 w-6 text-black-c' /> */}
          <UserAvatar url={user?.imageUrl} size={10} />
        </div>

        <Auth hide />
      </div>
    </header>
  )
})

export default Header
