import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import UserSidebar from '../UserSidebar'
import UserAdverts from '../UserAdverts'
import UserDrafts from '../UserDrafts'
import UserSubscribers from '../UserSubscribers'
import UserFavorites from '../UserFavorites'
import SectionTitle from '../UserSectionTitle'

interface Props {
  isCurrentUser: boolean
}

const UserMobile: FC<Props> = observer(({isCurrentUser}) => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const {activeUserPage, setActiveUserPage} = useGeneralStore()
  useEffect(() => setActiveUserPage('adverts'), [query])

  return (
    <>
      <HeaderFooterWrapper>
        <div className='py-8 min-h-1/2'>
          <div className='mx-4 flex justify-between'>
            <main className='w-full relative drop-shadow-card'>
              {((isCurrentUser && !activeUserPage) || !isCurrentUser) && (
                <UserSidebar />
              )}
              {activeUserPage === 'subscribers' && (
                <div
                  className={`${
                    activeUserPage !== 'subscribers' ? 'hidden' : ''
                  }`}>
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
                  <SectionTitle title={t('DRAFTS')} />
                  <UserDrafts />
                </div>
              )}
              {activeUserPage === 'favorites' && (
                <div>
                  <SectionTitle title={t('FAVORITE')} />
                  <UserFavorites />
                </div>
              )}
            </main>
          </div>
        </div>
      </HeaderFooterWrapper>
    </>
  )
})

export default UserMobile
