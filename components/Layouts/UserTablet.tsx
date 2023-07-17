import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcAds from 'icons/material/Ads.svg'
import IcCreate from 'icons/material/Create.svg'
import {useWindowSize} from 'react-use'
import {useRouter} from 'next/router'
import {ChevronRight, Discount, Heart2, Logout} from 'react-iconly'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import UserSidebar from '../UserSidebar'
import UserAdverts from '../UserAdverts'
import UserDrafts from '../UserDrafts'
import UserSubscribers from '../UserSubscribers'
import UserFavorites from '../UserFavorites'
import SectionTitle from '../UserSectionTitle'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import UserDiscountProgram from '../UserDiscountProgram'
import UserProfileTablet from '../UserProfileTablet'
import Button from '../Buttons/Button'
import {robustShallowUpdateQuery} from '../../helpers'
import LogoutButton from '../Auth/LogoutButton'

interface Props {
  isCurrentUser: boolean
}

const UserTablet: FC<Props> = observer(({isCurrentUser}) => {
  const {t} = useTranslation()
  const {activeUserPage, setActiveUserPage} = useGeneralStore()
  const router = useRouter()
  const {width} = useWindowSize()
  useEffect(() => {
    setActiveUserPage('user_navigation')
  }, [])

  return (
    <>
      <HeaderFooterWrapper isTablet>
        <div className='py-8 m:flex min-h-1/2'>
          <div className='m:flex m:mx-12 m:justify-center m:w-full'>
            <div className='mx-4 s:mx-8 m:mx-0'>
              {((activeUserPage === 'adverts' && !isCurrentUser) ||
                activeUserPage === 'user_navigation') && <UserProfileTablet />}

              {isCurrentUser && activeUserPage === 'user_navigation' && (
                <div className='rounded-2xl justify-between bg-white shadow-1 py-6 space-y-9 my-10'>
                  <Button
                    className='w-full hover:text-primary-500 text-greyscale-900'
                    onClick={() => {
                      robustShallowUpdateQuery(router, {page: 'adverts'})
                    }}>
                    <div className='flex justify-between px-7 w-full'>
                      <div className='flex items-center space-x-4'>
                        <IcAds className='w-7 h-7 fill-current' />
                        <span className='text-body-14 s:text-body-16'>
                          {t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                        </span>
                      </div>
                      <div className='flex'>
                        <ChevronRight set='light' size={24} />
                      </div>
                    </div>
                  </Button>

                  <Button
                    className='w-full hover:text-primary-500 text-greyscale-900 space-x-4'
                    onClick={() => {
                      robustShallowUpdateQuery(router, {
                        page: 'discount_program',
                      })
                    }}>
                    <div className='flex justify-between px-7 w-full'>
                      <div className='flex items-center space-x-4'>
                        <Discount filled size={28} />
                        <span className='text-body-14 s:text-body-16'>
                          {t('DISCOUNT_PROGRAM')}
                        </span>
                      </div>
                      <div className='flex'>
                        <ChevronRight set='light' size={24} />
                      </div>
                    </div>
                  </Button>
                  <div id='drafts-tour' className='rounded-2xl'>
                    <Button
                      onClick={() => {
                        robustShallowUpdateQuery(router, {page: 'drafts'})
                      }}
                      className='w-full hover:text-primary-500 text-greyscale-900 space-x-4'>
                      <div className='flex justify-between px-7 w-full'>
                        <div className='flex items-center space-x-4'>
                          <IcCreate className='fill-current h-7 w-7' />
                          <span className='text-body-14 s:text-body-16'>
                            {t('DRAFTS')}
                          </span>
                        </div>
                        <div className='flex'>
                          <ChevronRight set='light' size={24} />
                        </div>
                      </div>
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      robustShallowUpdateQuery(router, {page: 'favorites'})
                    }}
                    className='w-full hover:text-primary-500 text-greyscale-900 space-x-4'>
                    <div className='flex justify-between px-7 w-full'>
                      <div className='flex items-center space-x-4'>
                        <Heart2 filled size={28} />
                        <span className='text-body-14 s:text-body-16'>
                          {t('FAVORITE')}
                        </span>
                      </div>
                      <div className='flex'>
                        <ChevronRight set='light' size={24} />
                      </div>
                    </div>
                  </Button>
                  <LogoutButton className='text-greyscale-500 space-x-4 px-7'>
                    <>
                      <Logout filled size={28} />
                      <span className='text-body-14 s:text-body-16'>
                        {t('EXIT')}
                      </span>
                    </>
                  </LogoutButton>
                </div>
              )}

              <main className='w-full  relative drop-shadow-card'>
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

                {((isCurrentUser && activeUserPage === 'adverts') ||
                  !activeUserPage) && (
                  <div>
                    <SectionTitle
                      title={t(isCurrentUser ? 'MY_ADVERTISIMENT' : 'ADS')}
                    />
                    <UserAdverts />
                  </div>
                )}
                {(activeUserPage === 'user_navigation' ||
                  activeUserPage === 'adverts') &&
                  !isCurrentUser && (
                    <div className='mt-10'>
                      <UserAdverts />
                    </div>
                  )}
                {activeUserPage === 'discount_program' && (
                  <div>
                    <SectionTitle title={t('DISCOUNT_PROGRAM')} />
                    <UserDiscountProgram />
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

export default UserTablet
