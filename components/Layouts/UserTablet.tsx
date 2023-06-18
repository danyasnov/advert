import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {ChevronLeft} from 'react-iconly'
import {isNumber} from 'lodash'
import {robustShallowUpdateQuery} from '../../helpers'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import UserSidebar from '../UserSidebar'
import UserAdverts from '../UserAdverts'
import UserDrafts from '../UserDrafts'
import UserSubscribers from '../UserSubscribers'
import UserFavorites from '../UserFavorites'
import SectionTitle from '../UserSectionTitle'
import Button from '../Buttons/Button'
import Logo from '../Logo'
import UserBurger from '../UserBurger'
import UserProfile from '../UserProfile'
import Tabs from '../Tabs'
import LoginModal from '../Auth/Login/LoginModal'
import Footer from '../Footer'

const getFavoriteTab = (t: TFunction, sizes) => [
  {title: `${t('FAVORITE')}`, id: 1, count: sizes[1]},
]

const getDraftTab = (t: TFunction, sizes) => [
  {title: `${t('DRAFTS')}`, id: 1, count: sizes[1]},
]

interface Props {
  isCurrentUser: boolean
}

const UserTablet: FC<Props> = observer(({isCurrentUser}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = useRouter()
  const {showLogin, setShowLogin} = useGeneralStore()
  const {activeUserPage, setActiveUserPage} = useGeneralStore()
  const {user, userFavorite} = useUserStore()

  const favoriteTab = getFavoriteTab(t, {
    1: isNumber(userFavorite.count) ? userFavorite.count : '',
  })
  const draftTab = getDraftTab(t, {
    1: isNumber(user.draftsProductCount) ? user.draftsProductCount : '',
  })

  useEffect(() => setActiveUserPage('adverts'), [query])

  return (
    <>
      <div className='hidden s:flex m:hidden justify-between items-center mt-7 mx-8'>
        <Button
          onClick={() => {
            router.back()
          }}>
          <ChevronLeft set='light' size={24} />
        </Button>
        <div
          className={`${
            activeUserPage === 'chat' || activeUserPage === 'subscribers'
              ? 'hidden'
              : 'block'
          } `}>
          <Logo />
        </div>
        <span
          className={`${
            activeUserPage !== 'chat' ? 'hidden' : 'block'
          } text-body-16`}>
          {t('MESSAGES')}
        </span>
        <span
          className={`${
            activeUserPage !== 'subscribers' ? 'hidden' : 'block'
          } text-body-16`}>
          {t('SUBSCRIBERS_AND_SUBSCRIPTIONS')}
        </span>
        <UserBurger
          onLogin={() => {
            setShowLogin(true)
          }}
        />
      </div>

      <div className='py-8 s:py-4 m:py-8 m:flex min-h-1/2'>
        <div className='m:flex m:mx-12 m:justify-center m:w-full'>
          <div className='m:w-944px l:w-[1208px] mx-4 s:mx-8 m:mx-0 flex justify-between'>
            <main className='w-full m:w-[614px] l:w-896px relative drop-shadow-card'>
              <div
                className={`${
                  activeUserPage === 'chat' || activeUserPage === 'subscribers'
                    ? 's:hidden'
                    : 's:block'
                } hidden m:hidden `}>
                <UserProfile />
              </div>
              {((isCurrentUser && !activeUserPage) || !isCurrentUser) && (
                <div className='s:hidden'>
                  <UserSidebar />
                </div>
              )}
              {activeUserPage === 'subscribers' && (
                <div>
                  <SectionTitle
                    title={t(
                      isCurrentUser
                        ? 'MY_PROFILE'
                        : 'SUBSCRIBERS_AND_SUBSCRIPTIONS',
                    )}
                  />
                  <UserSubscribers />
                </div>
              )}
              {activeUserPage === 'adverts' && (
                <div>
                  <div className={`${!isCurrentUser ? 'hidden' : ''}`}>
                    <SectionTitle
                      title={t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                    />
                  </div>
                  <UserAdverts />
                </div>
              )}
              {activeUserPage === 'drafts' && (
                <div>
                  <div className='z-10 relative mt-8 mb-10'>
                    <Tabs
                      items={isCurrentUser ? draftTab : null}
                      onChange={(id) => {
                        robustShallowUpdateQuery(router, {
                          page: 'drafts',
                          activeTab: id,
                        })
                      }}
                      value={1}
                    />
                  </div>
                  <UserDrafts />
                </div>
              )}
              {activeUserPage === 'favorites' && (
                <div>
                  <div className='z-10 relative mt-8 mb-10'>
                    <Tabs
                      items={isCurrentUser ? favoriteTab : null}
                      onChange={(id) => {
                        robustShallowUpdateQuery(router, {
                          page: 'favorites',
                          activeTab: id,
                        })
                      }}
                      value={1}
                    />
                  </div>
                  <UserFavorites />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
})

export default UserTablet
