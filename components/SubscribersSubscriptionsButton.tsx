import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import Button from './Buttons/Button'
import {useUserStore} from '../providers/RootStoreProvider'
import {robustShallowUpdateQuery} from '../helpers'

const SubscribersSubscriptionsButton: FC = () => {
  const {user} = useUserStore()
  const {t} = useTranslation()
  const router = useRouter()

  return (
    <div className='flex s:space-x-4 m:space-x-0 justify-between mb-8 s:mb-0 m:mb-8 w-full'>
      <Button
        className='flex m:flex-col m:text-center group w-1/2 justify-center'
        onClick={() => {
          robustShallowUpdateQuery(router, {page: 'subscribers', activeTab: 1})
        }}>
        <span className='text-body-14 m:text-body-18 text-greyscale-900 group-hover:text-primary-500 font-semibold mr-2'>
          {user.subscribers}
        </span>
        <span className='text-body-14 m:text-body-16 text-greyscale-900 group-hover:text-primary-500 font-normal'>
          {t('SUBSCRIBERS')}
        </span>
      </Button>

      <Button
        className='flex m:flex-col m:text-center group w-1/2 justify-center whitespace-pre'
        onClick={() => {
          robustShallowUpdateQuery(router, {page: 'subscribers', activeTab: 2})
        }}>
        <span className='text-body-14 m:text-body-18 text-greyscale-900 group-hover:text-primary-500 font-semibold mr-2'>
          {user.subscribs}
        </span>
        <span className='text-body-14 m:text-body-16 text-greyscale-900 group-hover:text-primary-500 font-normal'>
          {t('SUBSCRIPTIONS')}
        </span>
      </Button>
    </div>
  )
}

export default SubscribersSubscriptionsButton
