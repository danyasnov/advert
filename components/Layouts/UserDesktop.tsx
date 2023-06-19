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

const UserDesktop: FC<Props> = observer(({isCurrentUser}) => {
  const {t} = useTranslation()
  const {activeUserPage} = useGeneralStore()
  return (
    <>
      <HeaderFooterWrapper>
        <div className='m:py-8 m:flex min-h-1/2'>
          <div className='m:flex m:mx-12 m:justify-center m:w-full'>
            <div className='m:w-944px l:w-[1208px] mx-4 s:mx-8 m:mx-0 flex justify-between'>
              <aside className='hidden m:block s:w-[224px] m:w-[280px] drop-shadow-card'>
                <UserSidebar />
              </aside>
              <main className='w-full m:w-[614px] l:w-896px relative drop-shadow-card'>
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

                {(activeUserPage === 'adverts' || !activeUserPage) && (
                  <div>
                    <SectionTitle
                      title={t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                    />
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
        </div>
      </HeaderFooterWrapper>
    </>
  )
})

export default UserDesktop
