import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {isNumber, toNumber} from 'lodash'
import IcUser from 'icons/material/User.svg'
import IcClear from 'icons/material/Clear.svg'
import {AdvertiseListItemModel} from 'front-api/src/index'
import {useRouter} from 'next/router'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import UserProfile from '../UserProfile'
import Tabs from '../Tabs'
import UserRatings from '../UserRatings'
import UserSidebar from '../UserSidebar'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import Card from '../Cards/Card'

const getTabs = (t: TFunction, sizes) => [
  {title: `${t('MODERATION')} ${sizes[1]}`, id: 1},
  {title: `${t('SALE')} ${sizes[2]}`, id: 2},
  {title: `${t('SOLD')} ${sizes[3]}`, id: 3},
  {title: `${t('ARCHIVE')} ${sizes[4]}`, id: 4},
]

const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const [activeTab, setActiveTab] = useState(
    query.activeTab ? toNumber(query.activeTab) : 2,
  )
  const {
    userSale,
    userSold,
    user,
    fetchProducts,
    fetchRatings,
    userFavorite,
    userOnModeration,
    userArchive,
    fetchDrafts,
    drafts,
  } = useUserStore()
  const {setFooterVisibility, userHash, activeUserPage, setActiveUserPage} =
    useGeneralStore()
  const isCurrentUser = userHash === user.hash
  const [showProfile, setShowProfile] = useState(false)
  useEffect(() => {
    fetchProducts({page: 1, path: 'userSold'})
    fetchRatings()
    if (isCurrentUser) {
      fetchProducts({page: 1, path: 'userOnModeration'})
      fetchProducts({page: 1, path: 'userArchive'})
      fetchProducts({page: 1, path: 'userFavorite'})
      fetchDrafts()
    }
    return () => setActiveUserPage('adverts')
  }, [fetchProducts, fetchRatings, isCurrentUser, setActiveUserPage])
  const tabs = getTabs(t, {
    1: isNumber(userOnModeration.count) ? userOnModeration.count : '',
    2: userSale.count,
    3: isNumber(userSold.count) ? userSold.count : '',
    4: isNumber(userArchive.count) ? userArchive.count : '',
  })
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
      <div className='bg-white px-4 s:pl-16 m:pl-8 s:px-8 flex relative min-h-2/3'>
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
              <UserProfile onSelect={() => setShowProfile(false)} />
            ) : (
              <>
                {activeUserPage === 'adverts' && (
                  <>
                    <Tabs
                      items={isCurrentUser ? tabs : tabs.slice(1, 3)}
                      onChange={(id) => setActiveTab(id)}
                      value={activeTab}
                    />
                    <div className='block h-4 m:h-6' />
                    {isCurrentUser && activeTab === 1 && (
                      <ScrollableCardGroup
                        products={userOnModeration.items}
                        page={userOnModeration.page}
                        count={userOnModeration.count}
                        state={userOnModeration.state}
                        limit={userOnModeration.limit}
                        hideNotFoundDescription
                        fetchProducts={() => {
                          fetchProducts({
                            page: userOnModeration.page + 1,
                            path: 'userOnModeration',
                          })
                        }}
                      />
                    )}
                    {activeTab === 2 && (
                      <ScrollableCardGroup
                        products={userSale.items}
                        page={userSale.page}
                        count={userSale.count}
                        state={userSale.state}
                        limit={userSale.limit}
                        hideNotFoundDescription
                        fetchProducts={() => {
                          fetchProducts({
                            page: userSale.page + 1,
                            path: 'userSale',
                          })
                        }}
                      />
                    )}
                    {activeTab === 3 && (
                      <ScrollableCardGroup
                        products={userSold.items}
                        page={userSold.page}
                        count={userSold.count}
                        state={userSold.state}
                        hideNotFoundDescription
                        limit={userSold.limit}
                        fetchProducts={() => {
                          fetchProducts({
                            page: userSold.page + 1,
                            path: 'userSold',
                          })
                        }}
                      />
                    )}
                    {isCurrentUser && activeTab === 4 && (
                      <ScrollableCardGroup
                        products={userArchive.items}
                        page={userArchive.page}
                        count={userArchive.count}
                        state={userArchive.state}
                        hideNotFoundDescription
                        limit={userArchive.limit}
                        fetchProducts={() => {
                          fetchProducts({
                            page: userArchive.page + 1,
                            path: 'userArchive',
                          })
                        }}
                      />
                    )}
                  </>
                )}
                {activeUserPage === 'reviews' && (
                  <div className='mt-8'>
                    <h1 className='text-body-14 text-black-b font-bold mb-6'>
                      {t('REVIEWS')}
                    </h1>
                    <UserRatings />
                  </div>
                )}
                {activeUserPage === 'favorites' && (
                  <div className='mt-8'>
                    <h1 className='text-body-14 text-black-b font-bold mb-6'>
                      {t('FAVORITE')}
                    </h1>
                    <ScrollableCardGroup
                      products={userFavorite.items}
                      page={userFavorite.page}
                      count={userFavorite.count}
                      state={userFavorite.state}
                      hideNotFoundDescription
                      limit={userFavorite.limit}
                      fetchProducts={() => {
                        fetchProducts({
                          page: userFavorite.page + 1,
                          path: 'userFavorite',
                        })
                      }}
                    />
                  </div>
                )}
                {activeUserPage === 'drafts' && (
                  <div className='mt-8'>
                    <h1 className='text-body-14 text-black-b font-bold mb-6'>
                      {t('DRAFTS')}
                    </h1>
                    <div className='flex flex-col m:items-start relative'>
                      <div className='grid grid-cols-2 xs:grid-cols-3 l:grid-cols-4 gap-2 s:gap-4 l:gap-4 mb-2 s:mb-4'>
                        {drafts.map((d) => (
                          <LinkWrapper
                            title={d.hash}
                            href={`/advert/create/${d.hash}`}
                            key={d.hash}
                            target='_blank'>
                            <Card
                              product={d as unknown as AdvertiseListItemModel}
                            />
                          </LinkWrapper>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default UserLayout
