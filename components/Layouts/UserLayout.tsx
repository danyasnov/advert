import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {isNumber} from 'lodash'
import IcUser from 'icons/material/User.svg'
import IcClear from 'icons/material/Clear.svg'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import UserProfile from '../UserProfile'
import Tabs from '../Tabs'
import UserRatings from '../UserRatings'
import UserSidebar from '../UserSidebar'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'

const getTabs = (t: TFunction, sizes) => [
  {title: `${t('SALE')} ${sizes[1]}`, id: 1},
  {title: `${t('SOLD')} ${sizes[2]}`, id: 2},
  {title: `${t('REVIEWS')} ${sizes[3]}`, id: 3},
]
const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(1)
  const {products, user, fetchProducts, fetchRatings, ratings} = useUserStore()
  const {setFooterVisibility} = useGeneralStore()
  const {userSale, userSold} = products
  const [showProfile, setShowProfile] = useState(false)
  useEffect(() => {
    fetchProducts({page: 1, path: 'userSold'})
    fetchRatings()
  }, [fetchProducts, fetchRatings])
  return (
    <HeaderFooterWrapper>
      <MetaTags
        title={t('USER_PAGE_TITLE', {hash: user.hash})}
        description={t('USER_PAGE_DESCRIPTION', {hash: user.hash})}
        user={user}
      />
      <div className='hidden s:block m:hidden sticky top-0 z-20 mt-px'>
        <div className='absolute'>
          <UserSidebar />
        </div>
      </div>
      <div className='bg-white px-4 s:pl-16 m:pl-8 s:px-8 flex relative min-h-half-screen'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <aside className='w-72 mt-8 hidden m:block'>
            <UserProfile />
          </aside>
          <main className='m:w-608px l:w-896px relative '>
            <div className='flex justify-end mt-2 s:hidden'>
              <Button
                onClick={() => {
                  setShowProfile(!showProfile)
                  setFooterVisibility(showProfile)
                }}
                className='w-10 h-10 rounded-full bg-white shadow-xl'>
                {showProfile ? (
                  <IcClear className='fill-current text-black-c w-6 h-6' />
                ) : (
                  <IcUser className='fill-current text-black-c w-6 h-6' />
                )}
              </Button>
            </div>
            {showProfile ? (
              <UserProfile />
            ) : (
              <>
                <Tabs
                  items={getTabs(t, {
                    1: userSale.count,
                    2: isNumber(userSold.count) ? userSold.count : '',
                    3: isNumber(ratings?.length) ? ratings.length : '',
                  })}
                  onChange={(id) => setActiveTab(id)}
                  value={activeTab}
                />
                <div className='block h-4 m:h-6' />
                {activeTab === 1 && (
                  <ScrollableCardGroup
                    products={userSale.items}
                    page={userSale.page}
                    count={userSale.count}
                    state={userSale.state}
                    limit={userSale.limit}
                    hideNotFoundDescription
                    fetchProducts={() => {
                      fetchProducts({page: userSale.page + 1, path: 'userSale'})
                    }}
                  />
                )}
                {activeTab === 2 && (
                  <ScrollableCardGroup
                    products={userSold.items}
                    page={userSold.page}
                    count={userSold.count}
                    state={userSold.state}
                    hideNotFoundDescription
                    limit={userSold.limit}
                    fetchProducts={() => {
                      fetchProducts({page: userSold.page + 1, path: 'userSold'})
                    }}
                  />
                )}
                {activeTab === 3 && <UserRatings />}
              </>
            )}
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default UserLayout
