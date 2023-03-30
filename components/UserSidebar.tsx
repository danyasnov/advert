import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {Heart2, Logout, Message} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import IcAds from 'icons/material/Ads.svg'
import IcCreate from 'icons/material/Create.svg'
import {useWindowSize} from 'react-use'
import {useRouter} from 'next/router'
import UserProfile from './UserProfile'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import LogoutButton from './Auth/LogoutButton'
import {robustShallowUpdateQuery} from '../helpers'

const UserSidebar: FC = observer(() => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
  const {activeUserPage, userHash} = useGeneralStore()
  const {user} = useUserStore()
  const router = useRouter()
  const isCurrentUser = userHash === user?.hash

  return (
    <div>
      <UserProfile />
      <div className='space-y-9 my-10'>
        {isCurrentUser && (
          <>
            <Button
              className={`${
                activeUserPage === 'adverts' ||
                (width >= 768 && activeUserPage === null)
                  ? 'text-primary-500'
                  : 'text-greyscale-900'
              } space-x-4`}
              onClick={() => {
                robustShallowUpdateQuery(router, {page: 'adverts'})
              }}>
              <IcAds className='w-7 h-7 fill-current' />
              <span className='text-body-14 s:text-body-16'>
                {t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
              </span>
            </Button>
            <div id='drafts-tour' className='rounded-2xl'>
              <Button
                onClick={() => {
                  robustShallowUpdateQuery(router, {page: 'drafts'})
                }}
                className={`${
                  activeUserPage === 'drafts'
                    ? 'text-primary-500'
                    : 'text-greyscale-900'
                } space-x-4`}>
                <IcCreate className='fill-current h-7 w-7' />
                <span className='text-body-14 s:text-body-16'>
                  {t('DRAFTS')}
                </span>
              </Button>
            </div>
            <Button
              onClick={() => {
                robustShallowUpdateQuery(router, {page: 'favorites'})
              }}
              className={`${
                activeUserPage === 'favorites'
                  ? 'text-primary-500'
                  : 'text-greyscale-900'
              } space-x-4`}>
              <Heart2 filled size={28} />
              <span className='text-body-14 s:text-body-16'>
                {t('FAVORITE')}
              </span>
            </Button>
            <Button
              onClick={() => {
                robustShallowUpdateQuery(router, {page: 'chat'})
              }}
              className={`${
                activeUserPage === 'chat'
                  ? 'text-primary-500'
                  : 'text-greyscale-900'
              } space-x-4`}>
              <Message filled size={28} />
              <span className='text-body-14 s:text-body-16'>
                {t('MESSAGES')}
              </span>
            </Button>
            <LogoutButton className='text-greyscale-500 space-x-4'>
              <>
                <Logout filled size={28} />
                <span className='text-body-14 s:text-body-16'>{t('EXIT')}</span>
              </>
            </LogoutButton>
          </>
        )}
      </div>
    </div>
  )
})
export default UserSidebar
