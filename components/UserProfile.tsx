import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import UserAvatar from './UserAvatar'
import SharePopup from './SharePopup'
import EditProfilePopup from './EditProfilePopup'
import SubscribeOnUser from './SubscribeOnUser'

const UserProfile: FC = observer(() => {
  const {user} = useUserStore()
  const {userHash} = useGeneralStore()
  const isCurrentUser = userHash === user?.hash

  const {t} = useTranslation()
  return (
    <div className='flex flex-col items-center rounded-2xl bg-white py-5 px-7'>
      <div className='flex s:flex-col justify-start s:items-center w-full'>
        <div className='hidden s:block mb-3'>
          <UserAvatar
            url={user.imageUrl}
            name={user.name}
            key={user.imageUrl}
            size={30}
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
          <span className='hidden s:flex mb-3 text-body-14 text-green text-center'>
            {t('ONLINE')}
          </span>

          <span className='text-body-16 s:text-h-5 text-greyscale-900 font-bold mb-1 s:mb-3 break-words text-left s:text-center w-full'>
            {/* @ts-ignore */}
            {user.name} {user.surname}
          </span>
          <span className='s:hidden mb-4 text-body-14 text-green text-center'>
            {t('ONLINE')}
          </span>
          <div className='hidden s:block mb-6'>
            <SubscribeOnUser
              isSubscribed={user.isSubscribed}
              ownerId={user.hash}
              type='profile'
            />
          </div>
        </div>
      </div>

      <div className='s:hidden w-full border-b border-greyscale-100 mb-4' />

      <div className='flex justify-between mb-8 w-full'>
        <div className='flex s:flex-col s:text-center w-1/2 justify-center'>
          <span className='text-body-14 m:text-body-18 text-greyscale-900 font-semibold mr-2'>
            {user.subscribers}
          </span>
          <span className='text-body-14 m:text-body-16 text-greyscale-900 font-normal'>
            {t('SUBSCRIBERS')}
          </span>
        </div>
        <div className='flex s:flex-col s:text-center w-1/2 justify-center whitespace-pre'>
          <span className='text-body-14 m:text-body-18 text-greyscale-900 font-semibold mr-2'>
            {user.subscribs}
          </span>
          <span className='text-body-14 m:text-body-16 text-greyscale-900 font-normal'>
            {t('SUBSCRIPTIONS')}
          </span>
        </div>
      </div>
      <div className='flex flex-col space-y-4 items-center'>
        <SharePopup userHash={user.hash} />
        {isCurrentUser && <EditProfilePopup />}
      </div>
    </div>
  )
})

export default UserProfile
