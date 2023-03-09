import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {
  checkToken,
  getLocationCodes,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../helpers'
import {activateWithCode, fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import SupportLayout from '../components/Layouts/SupportLayout'
import Storage from '../stores/Storage'

export default function Home() {
  return <SupportLayout />
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
  const promises = [fetchCountries(state.language), fetchCategories(storage)]

  const [countriesData, categoriesData] = await Promise.allSettled(
    promises,
  ).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null

  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        countriesStore: {
          countries,
        },
        generalStore: {
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
