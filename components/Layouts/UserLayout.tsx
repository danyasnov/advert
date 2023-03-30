import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import Joyride, {Step} from 'react-joyride'
import {parseCookies} from 'nookies'
import {TFunction, useTranslation} from 'next-i18next'
import {isNumber, toNumber} from 'lodash'
import {useRouter} from 'next/router'
import {
  ArrowLeft,
  ArrowLeftSquare,
  Delete,
  Edit,
  TickSquare,
} from 'react-iconly'
import {useWindowSize} from 'react-use'
import {DraftModel} from 'front-api/src/models'
import UserTabWrapper from '../UserTabWrapper'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import Tabs from '../Tabs'
import UserSidebar from '../UserSidebar'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'
import ChatList from '../Chat/ChatList'
import {makeRequest} from '../../api'
import {PagesType} from '../../stores/GeneralStore'
import {
  getQueryValue,
  robustShallowUpdateQuery,
  trackSingle,
  setCookiesObject,
} from '../../helpers'
import {SerializedCookiesState} from '../../types'

const getTabs = (t: TFunction, sizes) => [
  {title: `${t('MODERATION')}`, id: 1, count: sizes[1]},
  {title: `${t('SALE')}`, id: 2, count: sizes[2]},
  {title: `${t('SOLD')}`, id: 3, count: sizes[3]},
  {title: `${t('ARCHIVE')}`, id: 4, count: sizes[4]},
]

const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const activeTab = toNumber(getQueryValue(query, 'activeTab')) || 2
  const router = useRouter()
  const {userHash, activeUserPage, setActiveUserPage} = useGeneralStore()
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
  const [showTour, setShowTour] = useState(false)
  const [showDraftsTour, setShowDraftsTour] = useState(false)
  const [showUserTour, setUserShowTour] = useState(false)

  const isCurrentUser = userHash === user.hash
  const desktopUser = width >= 768 && activeUserPage === null
  const mobileUser = width < 768 && !isCurrentUser
  useEffect(() => {
    if (query.chatId) {
      setActiveUserPage('chat')
    } else if (query.page) {
      setActiveUserPage(query.page as PagesType)
    }
    return () => setActiveUserPage('adverts')
  }, [query])

  useEffect(() => {
    fetchProducts({page: 1, path: 'userSold'})
    fetchRatings()
    if (isCurrentUser) {
      fetchProducts({page: 1, path: 'userOnModeration'})
      fetchProducts({page: 1, path: 'userArchive'})
      fetchProducts({page: 1, path: 'userFavorite'})
      fetchProducts({page: 1, path: 'drafts', limit: 20})
    }
  }, [fetchProducts, fetchRatings, isCurrentUser])

  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    const visitCount = Number(cookies.visitCurrentUserTourCount) || 1
    const visitUserCount = Number(cookies.visitUserTourCount) || 1

    if (isCurrentUser) {
      const newVisitCount = visitCount <= 2 ? visitCount + 1 : visitCount
      setCookiesObject({visitCurrentUserTourCount: newVisitCount})
      setShowTour(visitCount === 1)
      setShowDraftsTour(visitCount === 2)
    } else {
      const newVisitUserCount =
        visitUserCount <= 2 ? visitUserCount + 1 : visitUserCount
      setCookiesObject({visitUserTourCount: newVisitUserCount})
      setUserShowTour(visitUserCount === 2)
    }
  }, [])

  const tabs = getTabs(t, {
    1: isNumber(userOnModeration.count) ? userOnModeration.count : '',
    2: userSale.count,
    3: isNumber(userSold.count) ? userSold.count : '',
    4: isNumber(userArchive.count) ? userArchive.count : '',
  })
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

  let getAdvertOptions
  if (isCurrentUser) {
    getAdvertOptions = ({setShowDeactivateModal, hash, state}) => {
      const remove = {
        title: 'REMOVE',
        icon: <Delete size={16} filled />,
        onClick: () => {
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
          setShowDeactivateModal(true)
        },
        cb: () => {
          router.reload()
        },
      }
      const edit = {
        title: 'EDIT_AD',
        icon: <Edit size={16} filled />,
        onClick: () => {
          router.push(`/advert/edit/${hash}`)
        },
      }
      const items = []

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

  const getDraftOptions = ({hash}) => {
    const edit = {
      title: 'EDIT_AD',
      icon: <Edit size={16} filled />,
      onClick: () => {
        router.push(`/advert/create/${hash}`)
      },
    }
    const remove = {
      title: 'REMOVE',
      icon: <Delete size={16} filled />,
      onClick: () => {
        makeRequest({
          url: '/api/delete-draft',
          method: 'post',
          data: {
            hash,
          },
        }).then(() => {
          router.reload()
        })
      },
    }

    return [edit, remove]
  }

  const steps1: Step[] = [
    {
      target: '#edit-profile',
      content: t('HINT_LANGUAGE'),
      disableBeacon: true,
      isFixed: true,
      placement: 'bottom-start',
      offset: 15,
    },
  ]

  const steps2: Step[] = [
    {
      target: '#drafts-tour',
      content: t('DRAFT_TIP'),
      disableBeacon: true,
      isFixed: true,
      placement: 'bottom',
      offset: 5,
    },
  ]

  const steps3: Step[] = [
    {
      target: '#profile',
      content: t('HINT_SUBSCRIBE'),
      disableBeacon: true,
      isFixed: true,
      placement: 'bottom',
      offset: 5,
    },
  ]

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
              {((isCurrentUser && !activeUserPage) || !isCurrentUser) && (
                <div className='s:hidden'>
                  <UserSidebar />
                </div>
              )}

              {(desktopUser || activeUserPage === 'adverts' || mobileUser) && (
                <div>
                  <div className={`${!isCurrentUser ? 'hidden' : ''}`}>
                    <SectionTitle
                      title={t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                    />
                  </div>

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
                  {isCurrentUser && activeTab === 2 && (
                    <UserTabWrapper
                      getOptions={getAdvertOptions}
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
                  {!isCurrentUser && activeTab === 2 && (
                    <UserTabWrapper
                      getOptions={getAdvertOptions}
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
                      tab='other-sale'
                    />
                  )}
                  {isCurrentUser && activeTab === 3 && (
                    <UserTabWrapper
                      getOptions={getAdvertOptions}
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
                  {!isCurrentUser && activeTab === 3 && (
                    <UserTabWrapper
                      getOptions={getAdvertOptions}
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
                      tab='other-sold'
                    />
                  )}
                  {isCurrentUser && activeTab === 4 && (
                    <UserTabWrapper
                      getOptions={getAdvertOptions}
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

                  <UserTabWrapper
                    getOptions={getDraftOptions}
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
                    tab='drafts'
                  />
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
              {isCurrentUser && showTour && (
                <Joyride
                  steps={steps1}
                  hideCloseButton
                  floaterProps={{hideArrow: true, disableFlip: true}}
                  styles={{
                    spotlight: {
                      borderRadius: '16px',
                    },
                    tooltip: {
                      paddingTop: '0',
                    },
                    buttonNext: {
                      backgroundColor: 'transparent',
                      padding: '0px 20px 10px 20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0',
                      outline: 'none',
                    },
                    tooltipContainer: {
                      textAlign: 'left',
                    },
                  }}
                  locale={{close: t('HINT_OK')}}
                />
              )}
              {isCurrentUser && showDraftsTour && (
                <Joyride
                  steps={steps2}
                  hideCloseButton
                  floaterProps={{hideArrow: true, disableFlip: true}}
                  styles={{
                    tooltip: {
                      paddingTop: '0',
                    },
                    buttonNext: {
                      backgroundColor: 'transparent',
                      padding: '0px 20px 10px 20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0',
                      outline: 'none',
                    },
                    tooltipContainer: {
                      textAlign: 'left',
                    },
                  }}
                  locale={{close: t('HINT_OK')}}
                />
              )}
              {/* {!isCurrentUser && showUserTour && (
                <Joyride
                  steps={steps3}
                  hideCloseButton
                  floaterProps={{hideArrow: true, disableFlip: true}}
                  styles={{
                    tooltip: {
                      paddingTop: '0',
                    },
                    buttonNext: {
                      backgroundColor: 'transparent',
                      padding: '0px 20px 10px 20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0',
                      outline: 'none',
                    },
                    tooltipContainer: {
                      textAlign: 'left',
                    },
                  }}
                  locale={{close: t('HINT_OK')}}
                />
                )} */}
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
