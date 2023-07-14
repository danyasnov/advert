import React, {FC} from 'react'
import {TFunction, useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {isNumber, toNumber} from 'lodash'
import {
  ArrowLeftSquare,
  ArrowRight,
  Delete,
  Edit,
  TickSquare,
  TimeCircle,
} from 'react-iconly'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {RemoveFromSaleType} from 'front-api'
import {
  useGeneralStore,
  useModalsStore,
  useUserStore,
} from '../providers/RootStoreProvider'
import UserTabWrapper from './UserTabWrapper'
import Button from './Buttons/Button'
import Tabs from './Tabs'
import {getQueryValue, robustShallowUpdateQuery} from '../helpers'
import {makeRequest} from '../api'

const getTabs = (t: TFunction, sizes) => [
  {title: `${t('MODERATION')}`, id: 1, count: sizes[1]},
  {title: `${t('SALE')}`, id: 2, count: sizes[2]},
  {title: `${t('SOLD')}`, id: 3, count: sizes[3]},
  {title: `${t('ARCHIVE')}`, id: 4, count: sizes[4]},
]

const UserAdverts: FC = observer(() => {
  const {t} = useTranslation()
  const {userHash} = useGeneralStore()
  const {setModal} = useModalsStore()
  const {
    userSale,
    userSold,
    user,
    fetchProducts,
    userOnModeration,
    userArchive,
  } = useUserStore()
  const isCurrentUser = userHash === user.hash
  const router = useRouter()
  const {query} = useRouter()
  const activeTab = toNumber(getQueryValue(query, 'activeTab')) || 2

  const tabs = getTabs(t, {
    1: isNumber(userOnModeration.count) ? userOnModeration.count : '',
    2: userSale.count,
    3: isNumber(userSold.count) ? userSold.count : '',
    4: isNumber(userArchive.count) ? userArchive.count : '',
  })

  const refreshAdvert = (hash) => {
    makeRequest({
      url: '/api/refresh-advert',
      data: {hash},
      method: 'post',
    }).then((data) => {
      if (data?.data?.status === 200) {
        toast.success(t('SUCCESSFULLY_PROMOTED'))
        router.reload()
      }
    })
  }

  let getAdvertOptions
  if (isCurrentUser) {
    getAdvertOptions = ({
      hash,
      state,
      showRefreshButton,
      title,
      images,
      price,
    }) => {
      const remove = {
        title: 'REMOVE',
        icon: <Delete size={16} filled />,
        onClick: () => {
          setModal('REMOVE_ADV', {
            onRemove: () => {
              makeRequest({
                url: `/api/delete-adv`,
                method: 'post',
                data: {
                  hash,
                },
              }).then(() => {
                router.reload()
              })
            },
          })
        },
      }
      const publish = {
        title: 'PUBLISH',
        icon: <TickSquare size={16} filled />,
        onClick: () => {
          makeRequest({
            url: `/api/publish-adv`,
            method: 'post',
            data: {
              hash,
            },
          }).then(() => {
            router.reload()
          })
        },
      }
      const deactivate = {
        title: 'REMOVE_FROM_SALE',
        icon: <ArrowLeftSquare size={16} filled />,
        onClick: () => {
          setModal('DEACTIVATE_ADV', {
            onSelect: (value: RemoveFromSaleType) =>
              makeRequest({
                url: `/api/deactivate-adv`,
                method: 'post',
                data: {
                  hash,
                  soldMode: value,
                },
              }).then(() => {
                router.reload()
              }),
            title,
            images,
            price,
          })
        },
      }
      const edit = {
        title: 'EDIT_AD',
        icon: <Edit size={16} filled />,
        onClick: () => {
          router.push(`/advert/edit/${hash}`)
        },
      }
      const refresh = {
        title: 'UPDATE_BEFORE_ARCHIVATION',
        icon: <TimeCircle size={16} filled />,
        onClick: () => refreshAdvert(hash),
      }
      const items = []

      if (showRefreshButton) {
        items.push(refresh)
      }

      if (['active', 'archived', 'blocked', 'draft'].includes(state)) {
        items.push(edit)
      }
      if (
        ['archived', 'sold', 'blockedPermanently', 'blocked', 'draft'].includes(
          state,
        )
      ) {
        if (state === 'archived') {
          items.push(publish)
        }
        items.push(remove)
      }
      if (state === 'active') {
        items.push(deactivate)
      }
      return items
    }
  }

  return (
    <div>
      <div className='z-10 relative mb-10'>
        <Tabs
          items={isCurrentUser ? tabs : tabs.slice(1, 3)}
          onChange={(id) => {
            robustShallowUpdateQuery(router, {
              page: 'adverts',
              activeTab: id,
            })
          }}
          value={activeTab}
        />
      </div>
      {isCurrentUser && activeTab === 1 && (
        <UserTabWrapper
          getOptions={getAdvertOptions}
          products={userOnModeration.items}
          page={userOnModeration.page}
          count={userOnModeration.count}
          state={userOnModeration.state || 'pending'}
          enableThreeColumnsForS
          disableVipWidth
          limit={userOnModeration.limit}
          fetchProducts={() => {
            fetchProducts({
              page: userOnModeration.page + 1,
              path: 'userOnModeration',
            })
          }}
          tab='moderation'
        />
      )}
      {activeTab === 2 && (
        <UserTabWrapper
          getOptions={getAdvertOptions}
          products={userSale.items}
          page={userSale.page}
          count={userSale.count}
          state={userSale.state}
          limit={userSale.limit}
          enableThreeColumnsForS
          disableVipWidth
          fetchProducts={() => {
            fetchProducts({
              page: userSale.page + 1,
              path: 'userSale',
            })
          }}
          tab={isCurrentUser ? 'sale' : 'other-sale'}
          renderFooter={(product) => {
            let title
            if (product.showRefreshButton) {
              if (product.daysBeforeArchive) {
                title = t('DAYS_TO_ARCHIVE', {
                  days: product.daysBeforeArchive,
                })
              } else {
                title = t('LAST_DAY_BEFORE_ARCHIVE')
              }

              return (
                <Button
                  className='flex justify-between w-full'
                  onClick={(e) => {
                    e.preventDefault()
                    refreshAdvert(product.hash)
                  }}>
                  <span className='text-body-12 font-bold text-error whitespace-nowrap truncate'>
                    {title}
                  </span>
                  <ArrowRight size={16} />
                </Button>
              )
            }
          }}
        />
      )}
      {activeTab === 3 && (
        <UserTabWrapper
          getOptions={getAdvertOptions}
          products={userSold.items}
          page={userSold.page}
          count={userSold.count}
          state={userSold.state}
          enableThreeColumnsForS
          disableVipWidth
          limit={userSold.limit}
          fetchProducts={() => {
            fetchProducts({
              page: userSold.page + 1,
              path: 'userSold',
            })
          }}
          tab={isCurrentUser ? 'sold' : 'other-sold'}
        />
      )}
      {isCurrentUser && activeTab === 4 && (
        <UserTabWrapper
          getOptions={getAdvertOptions}
          products={userArchive.items}
          page={userArchive.page}
          count={userArchive.count}
          state={userArchive.state}
          enableThreeColumnsForS
          disableVipWidth
          limit={userArchive.limit}
          fetchProducts={() => {
            fetchProducts({
              page: userArchive.page + 1,
              path: 'userArchive',
            })
          }}
          tab='archive'
        />
      )}
    </div>
  )
})
export default UserAdverts
