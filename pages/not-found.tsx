import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import NotFound from '../components/Layouts/NotFound'
import Storage from '../stores/Storage'
import {
  checkToken,
  getLocationCodes,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../helpers'
import {fetchCategories} from '../api/v2'

export default function NotFoundPage() {
  return <NotFound />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const storage = new Storage({
    ...state,
    userHash: state.hash,
    location: state.searchLocation,
  })
  const message = await checkToken(state.authNewToken)
  if (message === 'LOGIN_REDIRECT') {
    return redirectToLogin(ctx.resolvedUrl)
  }
  if (message === 'REFRESH_REDIRECT') {
    return redirectToRefresh(ctx.resolvedUrl)
  }
  const promises = [fetchCategories(storage)]

  const [categoriesData] = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        generalStore: {
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
