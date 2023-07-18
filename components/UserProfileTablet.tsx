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

const UserProfileTablet: FC = observer(() => {
  const {user} = useUserStore()
  const {userHash} = useGeneralStore()
  const isCurrentUser = userHash === user?.hash
  const {t} = useTranslation()

  return (
    <div className='flex rounded-2xl justify-between bg-white shadow-1 py-5 px-7'>
      <div className='flex space-x-4 '>
        <UserAvatar
          url={user.imageUrl}
          name={user.name}
          key={user.imageUrl}
          size={22.5}
        />
        <div className='flex flex-col h-[91px] justify-between'>
          <div className='flex flex-col'>
            <span className='text-body-16 text-greyscale-900 font-bold mb-1 break-words text-left w-full'>
              {/* @ts-ignore */}
              {user.name} {user.surname}
            </span>
            <span className='mb-3 text-body-12 text-green'>{t('ONLINE')}</span>
          </div>
          <SubscribersSubscriptionsButton />
        </div>
      </div>

      {isCurrentUser ? (
        <div className='flex space-x-5 self-start'>
          <SharePopup userHash={user.hash} />
          {isCurrentUser && <EditProfilePopup />}
        </div>
      ) : (
        <div className='mb-6'>
          <SubscribeOnUser
            isSubscribed={user.isSubscribed}
            ownerId={user.hash}
            type='profile'
          />
        </div>
      )}
    </div>
  )
})

export default UserProfileTablet
