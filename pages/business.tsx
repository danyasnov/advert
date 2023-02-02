import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {
  processCookies,
  redirectToLogin,
  refreshToken,
  setCookiesObject,
} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import BusinessLayout from '../components/Layouts/BusinessLayout'
import Storage from '../stores/Storage'

export default function Home() {
  return <BusinessLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const storage = new Storage({
    ...state,
    userHash: state.hash,
    location: state.searchLocation,
  })
  const newAuth = await refreshToken({
    authNewToken: state.authNewToken,
    authNewRefreshToken: state.authNewRefreshToken,
  })
  if (newAuth.authNewToken && newAuth.authNewRefreshToken) {
    storage.saveNewTokens({
      accessToken: newAuth.authNewToken,
      refreshToken: newAuth.authNewRefreshToken,
    })
    setCookiesObject(newAuth, ctx)
  } else if (newAuth.err === 'LOGIN_REDIRECT') {
    return redirectToLogin(ctx.resolvedUrl)
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
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
