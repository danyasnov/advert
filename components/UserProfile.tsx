import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {noop} from 'lodash'
import {useUserStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import Rating from './Rating'
import UserAvatar from './UserAvatar'
import SharePopup from './SharePopup'
import UserMenuList from './UserMenuList'

interface Props {
  onSelect?: () => void
}

const UserProfile: FC<Props> = observer(({onSelect = noop}) => {
  const {user} = useUserStore()
  const {t} = useTranslation()
  return (
    <div className='flex flex-col'>
      <h1 className='text-body-14 text-greyscale-900 font-bold mb-4 break-words'>
        {user.name}
      </h1>
      <div className='flex mb-2'>
        <UserAvatar url={user.imageUrl} name={user.name} key={user.imageUrl} />
        <div className='ml-2 flex flex-col justify-between'>
          <Rating rating={user.rating} ratingCount={user.ratingCount} />
          <span className='text-body-12 text-greyscale-900'>
            {t('SINCE', {date: unixToDate(user.registrationDate)})}
          </span>
        </div>
      </div>
      {!!user.settings?.location?.description && (
        <span className='text-body-12 text-greyscale-900'>
          {user.settings.location.description}
        </span>
      )}
      <div className=''>
        <div className='flex divide-x divide-shadow-b justify-between mt-3 mb-4'>
          <div className='flex flex-col w-1/2 items-center'>
            <span className='text-h-6 text-greyscale-900 font-bold'>
              {user.subscribers}
            </span>
            <span className='text-body-14 text-greyscale-900'>
              {t('SUBSCRIBERS')}
            </span>
          </div>
          <div className='flex flex-col w-1/2 items-center'>
            <span className='text-h-6 text-greyscale-900 font-bold'>
              {user.subscribs}
            </span>
            <span className='text-body-14 text-greyscale-900'>
              {t('SUBSCRIPTIONS')}
            </span>
          </div>
        </div>
        <UserMenuList collapsed={false} onSelect={onSelect} />
        <div className='pb-8 pt-4'>
          <SharePopup userHash={user.hash} />
        </div>
      </div>
    </div>
  )
})

export default UserProfile
