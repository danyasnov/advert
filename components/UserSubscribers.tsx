import React, {FC} from 'react'
import {TFunction, useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {isNumber, toNumber} from 'lodash'
import {useRouter} from 'next/router'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import Tabs from './Tabs'
import {getQueryValue, robustShallowUpdateQuery} from '../helpers'
import SubscribersSubscriptionsList from './SubscribersSubscriptionsList'

const getSubscribeTabs = (t: TFunction, sizes) => [
  {title: `${t('SUBSCRIBERS')}`, id: 1, count: sizes[1]},
  {title: `${t('SUBSCRIPTIONS')}`, id: 2, count: sizes[2]},
]

const UserSubscribers: FC = observer(() => {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = useRouter()
  const {user} = useUserStore()
  const {activeUserPage} = useGeneralStore()
  const activeSubscriptionTab = toNumber(getQueryValue(query, 'activeTab')) || 1

  const subscribeTabs = getSubscribeTabs(t, {
    1: isNumber(user.subscribers) ? user.subscribers : '',
    2: isNumber(user.subscribs) ? user.subscribs : '',
  })

  return (
    <div className={`${activeUserPage !== 'subscribers' ? 'hidden' : ''}`}>
      <div className='z-10 relative mb-10'>
        <Tabs
          items={subscribeTabs}
          onChange={(id) => {
            robustShallowUpdateQuery(router, {
              page: 'subscribers',
              activeTab: id,
            })
          }}
          value={activeSubscriptionTab}
        />
      </div>
      {activeSubscriptionTab === 1 && (
        <SubscribersSubscriptionsList ownerHash={user.hash} typeSub='2' />
      )}
      {activeSubscriptionTab === 2 && (
        <SubscribersSubscriptionsList ownerHash={user.hash} typeSub='1' />
      )}
    </div>
  )
})

export default UserSubscribers
