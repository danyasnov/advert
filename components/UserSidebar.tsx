import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {Heart2, Logout} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import IcAds from 'icons/material/Ads.svg'
import IcCreate from 'icons/material/Create.svg'
import {useWindowSize} from 'react-use'
import UserProfile from './UserProfile'
import {useGeneralStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {PagesType} from '../stores/GeneralStore'
import LogoutButton from './Auth/LogoutButton'

const UserSidebar: FC = observer(() => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
  const {setActiveUserPage, activeUserPage, user, userHash} = useGeneralStore()
  const isCurrentUser = userHash === user?.hash

  return (
    <div>
      <UserProfile />
      <div className='space-y-5 my-10'>
        <Button
          className={`${
            activeUserPage === 'adverts' ||
            (width >= 768 && activeUserPage === null)
              ? 'text-primary-500'
              : 'text-greyscale-900'
          } space-x-4`}
          onClick={() => {
            setActiveUserPage('adverts' as PagesType)
          }}>
          <IcAds className='w-7 h-7 fill-current' />
          <span className='text-body-16'>
            {t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
          </span>
        </Button>
        {isCurrentUser && (
          <>
            <Button
              onClick={() => {
                setActiveUserPage('drafts' as PagesType)
              }}
              className={`${
                activeUserPage === 'drafts'
                  ? 'text-primary-500'
                  : 'text-greyscale-900'
              } space-x-4`}>
              <IcCreate className='fill-current h-7 w-7' />
              <span className='text-body-16'>{t('DRAFTS')}</span>
            </Button>
            <Button
              onClick={() => {
                setActiveUserPage('favorites' as PagesType)
              }}
              className={`${
                activeUserPage === 'favorites'
                  ? 'text-primary-500'
                  : 'text-greyscale-900'
              } space-x-4`}>
              <Heart2 filled size={28} />
              <span className='text-body-16'>{t('FAVORITE')}</span>
            </Button>
            <LogoutButton className='text-greyscale-500 space-x-4'>
              <>
                <Logout filled size={28} />
                <span className='text-body-16'>{t('EXIT')}</span>
              </>
            </LogoutButton>
          </>
        )}
      </div>
    </div>
  )
})
export default UserSidebar
