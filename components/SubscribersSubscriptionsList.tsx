import {FC, useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import {makeRequest} from '../api'
import UserAvatar from './UserAvatar'
import SubscribeOnUser from './SubscribeOnUser'
import Button from './Buttons/Button'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import EmptyTab from './EmptyTab'

interface Props {
  ownerHash: string
  typeSub: string
}

interface Subscription {
  id: number
  name: string
  surname: string
  url: string
  isSubscribed: boolean
}

const SubscribersSubscriptionsList: FC<Props> = ({ownerHash, typeSub}) => {
  const {t} = useTranslation()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const {userHash} = useGeneralStore()
  const {user} = useUserStore()
  const router = useRouter()

  const fetchSubscribersSubscriptions = async () => {
    const response = await makeRequest({
      url: '/api/user-subscribers-subscriptions',
      data: {
        hash: ownerHash,
        type: typeSub,
      },
      method: 'POST',
    })
    setSubscriptions(response.data?.result)
  }

  useEffect(() => {
    fetchSubscribersSubscriptions()
  }, [ownerHash, typeSub])

  if (isEmpty(subscriptions) && typeSub === '1') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description={t(
            userHash === user.hash
              ? 'SUBSCRIBE_VIA_PROFILE'
              : 'USER_HAS_NO_SUBSCRIBERS',
          )}
          img='/img/empty-tabs/following.png'
        />
      </div>
    )
  }

  if (isEmpty(subscriptions) && typeSub === '2') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description={t(
            userHash === user.hash
              ? 'USERS_SHOWN'
              : 'THIS_USER_HAS_NO_FOLLOWERS_YET',
          )}
          img='/img/empty-tabs/followers.png'
        />
      </div>
    )
  }

  return (
    <div className='grid  m:grid-cols-2 gap-5 mb-20'>
      {subscriptions.map((subscription) => (
        <div className='flex bg-white shrink-0 rounded-3xl w-full shadow-1 py-[18px] px-[13px] s:px-3 justify-between'>
          <div className='flex items-center shrink-0 space-x-4'>
            <UserAvatar
              url={subscription.url}
              name={subscription.name}
              size={11}
            />
            <Button
              onClick={() => {
                router.push(`/user/${subscription.id}`)
              }}>
              <span
                className={`break-words line-clamp-2 text-left ${
                  userHash ? 'w-[71px]' : ''
                }  text-body-14 s:text-body-16  text-greyscale-900 hover:text-primary-500`}>
                {subscription.name} {subscription.surname}
              </span>
            </Button>
          </div>
          {subscription.id.toString() !== userHash && (
            <div className='flex items-center'>
              <SubscribeOnUser
                isSubscribed={subscription.isSubscribed}
                ownerId={subscription.id.toString()}
                type='list'
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SubscribersSubscriptionsList
