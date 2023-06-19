import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import Joyride, {Step} from 'react-joyride'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useGeneralStore, useUserStore} from '../../providers/RootStoreProvider'
import MetaTags from '../MetaTags'
import {setCookiesObject} from '../../helpers'
import {SerializedCookiesState} from '../../types'
import {PagesType} from '../../stores/GeneralStore'
import UserMobile from './UserMobile'
import UserTablet from './UserTablet'
import UserDesktop from './UserDesktop'

const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const {userHash, activeUserPage, setActiveUserPage} = useGeneralStore()
  const {user, fetchProducts, fetchRatings} = useUserStore()
  const [showTour, setShowTour] = useState(false)
  const [showDraftsTour, setShowDraftsTour] = useState(false)
  const [showUserTour, setUserShowTour] = useState(false)
  const isCurrentUser = userHash === user.hash
  useEffect(() => {
    if (query.page) {
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
    <>
      <MetaTags
        title={t('USER_PAGE_TITLE', {hash: user.hash})}
        description={t('USER_PAGE_DESCRIPTION', {hash: user.hash})}
        user={user}
      />
      <div className='s:hidden'>
        <UserMobile isCurrentUser={isCurrentUser} />
      </div>
      <div className='hidden s:block m:hidden'>
        <UserTablet isCurrentUser={isCurrentUser} />
      </div>
      <div className='hidden m:block'>
        <UserDesktop isCurrentUser={isCurrentUser} />
      </div>
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
      {!isCurrentUser && showUserTour && (
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
      )}
    </>
  )
})

export default UserLayout
