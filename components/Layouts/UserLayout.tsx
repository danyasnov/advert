import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {get, isEmpty, toNumber} from 'lodash'
import {useRouter} from 'next/router'
import {ArrowLeft} from 'react-iconly'
import {useWindowSize} from 'react-use'
import {toJS} from 'mobx'
import {DraftModel} from 'front-api/src/models/index'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import UserTabWrapper from '../UserTabWrapper'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import Tabs from '../Tabs'
import UserSidebar from '../UserSidebar'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'
import Card from '../Cards/Card'
import ChatList from '../ChatList'
import EmptyTab from '../EmptyTab'

const getTabs = (t: TFunction) => [
  {title: `${t('MODERATION')}`, id: 1},
  {title: `${t('SALE')}`, id: 2},
  {title: `${t('SOLD')}`, id: 3},
  {title: `${t('ARCHIVE')}`, id: 4},
]

const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const [activeTab, setActiveTab] = useState(
    query.activeTab ? toNumber(query.activeTab) : 2,
  )
  const router = useRouter()
  useEffect(() => {
    router.push(`/user/${query.id}?activeTab=${activeTab}`, undefined, {
      shallow: true,
    })
  }, [activeTab])
  const {width} = useWindowSize()
  const {
    userSale,
    userSold,
    user,
    fetchProducts,
    fetchRatings,
    userFavorite,
    userOnModeration,
    userArchive,
    drafts,
  } = useUserStore()
  const {userHash, activeUserPage, setActiveUserPage} = useGeneralStore()
  const isCurrentUser = userHash === user.hash
  useEffect(() => {
    setActiveUserPage('chat')
    fetchProducts({page: 1, path: 'userSold'})
    fetchRatings()
    if (isCurrentUser) {
      fetchProducts({page: 1, path: 'userOnModeration'})
      fetchProducts({page: 1, path: 'userArchive'})
      fetchProducts({page: 1, path: 'userFavorite'})
      fetchProducts({page: 1, path: 'drafts', limit: 20})
    }
    return () => setActiveUserPage('adverts')
  }, [fetchProducts, fetchRatings, isCurrentUser, setActiveUserPage])
  const tabs = getTabs(t)
  const mappedDrafts = ((drafts.items as unknown as DraftModel[]) || []).map(
    (d) => {
      const title =
        d.advertDraft.content[0]?.title || d.advertDraft.categoryName
      return {
        ...d,
        ...d.advertDraft,
        title,
        url: `/advert/create/${d.hash}`,
        images: d.advertDraft.photos
          ? d.advertDraft.photos.map((p) => p.url)
          : [],
      }
    },
  )
  return (
    <HeaderFooterWrapper>
      <MetaTags
        title={t('USER_PAGE_TITLE', {hash: user.hash})}
        description={t('USER_PAGE_DESCRIPTION', {hash: user.hash})}
        user={user}
      />
      <div className='py-8 m:flex min-h-1/2'>
        <div className='m:flex m:mx-12 m:justify-center m:w-full'>
          <div className='m:w-944px l:w-[1208px] mx-4 s:mx-8 m:mx-0 flex justify-between'>
            <aside className='hidden s:block s:w-[224px] m:w-[280px] drop-shadow-card'>
              <UserSidebar />
            </aside>
            <main className='w-full s:w-[464px] m:w-[614px] l:w-896px relative drop-shadow-card'>
              <div className='s:hidden'>
                {!activeUserPage && <UserSidebar />}
              </div>
              {((width >= 768 && activeUserPage === null) ||
                activeUserPage === 'adverts') && (
                <div>
                  <SectionTitle
                    title={t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                  />

                  <div className='z-10 relative mb-10'>
                    <Tabs
                      items={isCurrentUser ? tabs : tabs.slice(1, 3)}
                      onChange={(id) => setActiveTab(id)}
                      value={activeTab}
                    />
                  </div>
                  {isCurrentUser && activeTab === 1 && (
                    <UserTabWrapper
                      showMenu={isCurrentUser}
                      products={userOnModeration.items}
                      page={userOnModeration.page}
                      count={userOnModeration.count}
                      state={userOnModeration.state || 'pending'}
                      enableTwoColumnsForS
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
                      showMenu={isCurrentUser}
                      products={userSale.items}
                      page={userSale.page}
                      count={userSale.count}
                      state={userSale.state}
                      limit={userSale.limit}
                      enableTwoColumnsForS
                      disableVipWidth
                      fetchProducts={() => {
                        fetchProducts({
                          page: userSale.page + 1,
                          path: 'userSale',
                        })
                      }}
                      tab='sale'
                    />
                  )}
                  {activeTab === 3 && (
                    <UserTabWrapper
                      showMenu={isCurrentUser}
                      products={userSold.items}
                      page={userSold.page}
                      count={userSold.count}
                      state={userSold.state}
                      enableTwoColumnsForS
                      disableVipWidth
                      limit={userSold.limit}
                      fetchProducts={() => {
                        fetchProducts({
                          page: userSold.page + 1,
                          path: 'userSold',
                        })
                      }}
                      tab='sold'
                    />
                  )}
                  {isCurrentUser && activeTab === 4 && (
                    <UserTabWrapper
                      showMenu={isCurrentUser}
                      products={userArchive.items}
                      page={userArchive.page}
                      count={userArchive.count}
                      state={userArchive.state}
                      enableTwoColumnsForS
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
              )}
              {activeUserPage === 'drafts' && (
                <div>
                  <SectionTitle title={t('DRAFTS')} />

                  {isEmpty(drafts) ? (
                    <div className='flex justify-center'>
                      <EmptyTab
                        description='DRAWINGS_EMPTY'
                        img='/img/drafts-tab.svg'
                      />
                    </div>
                  ) : (
                    <ScrollableCardGroup
                      showMenu={isCurrentUser}
                      // @ts-ignore
                      products={mappedDrafts}
                      page={drafts.page}
                      count={drafts.count}
                      state={drafts.state}
                      enableTwoColumnsForS
                      disableVipWidth
                      limit={drafts.limit}
                      fetchProducts={() => {
                        fetchProducts({
                          page: drafts.page + 1,
                          path: 'drafts',
                          limit: 20,
                        })
                      }}
                    />
                  )}
                </div>
              )}
              {activeUserPage === 'favorites' && (
                <div>
                  <SectionTitle title={t('FAVORITE')} />
                  <UserTabWrapper
                    products={userFavorite.items}
                    page={userFavorite.page}
                    count={userFavorite.count}
                    state={userFavorite.state}
                    enableTwoColumnsForS
                    disableVipWidth
                    limit={userFavorite.limit}
                    fetchProducts={() => {
                      fetchProducts({
                        page: userFavorite.page + 1,
                        path: 'userFavorite',
                      })
                    }}
                    tab='favorites'
                  />
                </div>
              )}
              {activeUserPage === 'chat' && (
                <div>
                  <SectionTitle title={t('MESSAGES')} />
                  <ChatList />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

const SectionTitle: FC<{title: string}> = observer(({title}) => {
  const {setActiveUserPage} = useGeneralStore()
  const className = 'text-h-5 font-bold text-greyscale-900'
  return (
    <div className='mb-8 z-10 relative'>
      <Button onClick={() => setActiveUserPage(null)} className='s:hidden'>
        <ArrowLeft size={24} />
        <span className={`${className} ml-2`}>{title}</span>
      </Button>
      <span className={`${className} hidden s:block`}>{title}</span>
    </div>
  )
})

export default UserLayout
