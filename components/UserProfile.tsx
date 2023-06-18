import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import {useWindowSize} from 'react-use'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import UserAvatar from './UserAvatar'
import SharePopup from './SharePopup'
import EditProfilePopup from './EditProfilePopup'
import SubscribeOnUser from './SubscribeOnUser'
import SubscribersSubscriptionsButton from './SubscribersSubscriptionsButton'

const UserProfile: FC = observer(() => {
  const {user} = useUserStore()
  const {userHash} = useGeneralStore()
  const isCurrentUser = userHash === user?.hash
  const {width} = useWindowSize()
  const tablet = width >= 768 && width < 1024

  const {t} = useTranslation()
  return (
    <div className='flex flex-col items-center rounded-2xl bg-white s:bg-inherit m:bg-white py-5 px-7'>
      <div className='flex s:flex-col justify-start s:items-center w-full'>
        <div className='hidden s:block mb-3'>
          <UserAvatar
            url={user.imageUrl}
            name={user.name}
            key={user.imageUrl}
            size={tablet ? 15 : 30}
          />
        </div>
        <div className='s:hidden mb-4'>
          <UserAvatar
            url={user.imageUrl}
            name={user.name}
            key={user.imageUrl}
            size={12}
          />
        </div>
        <div className='flex flex-col items-start s:items-center ml-3 s:ml-0'>
          <span className='hidden s:flex mb-3 s:mb-2 m:mb-3 text-body-14 text-green text-center'>
            {t('ONLINE')}
          </span>

          <span className='text-body-16 m:text-h-5 text-greyscale-900 font-bold mb-1 m:mb-3 break-words text-left s:text-center w-full'>
            {/* @ts-ignore */}
            {user.name} {user.surname}
          </span>
          <span className='s:hidden mb-4 text-body-14 text-green text-center'>
            {t('ONLINE')}
          </span>
          <div className='hidden s:block mb-6 s:mb-4 m:mb-6'>
            <SubscribeOnUser
              isSubscribed={user.isSubscribed}
              ownerId={user.hash}
              type='profile'
            />
          </div>
        </div>
      </div>

      <div className='s:hidden w-full border-b border-greyscale-100 mb-4' />
      <div className='w-full s:w-[193px] m:w-full'>
        <SubscribersSubscriptionsButton />
      </div>

      <div className='flex flex-col space-y-4 items-center'>
        <div className='s:hidden items-center'>
          <SubscribeOnUser
            isSubscribed={user.isSubscribed}
            ownerId={user.hash}
            type='profileSmall'
          />
        </div>
        <SharePopup userHash={user.hash} />
        {isCurrentUser && <EditProfilePopup />}
      </div>
    </div>
  )
})

export default UserProfile
