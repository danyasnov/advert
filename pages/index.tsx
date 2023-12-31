import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {AuthType} from 'front-api/src/models'
import {VerifyMode} from 'front-api/src/models/auth'
import {
  checkToken,
  getLocationCodes,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../helpers'
import {fetchCountries} from '../api/v1'
import {checkCode, fetchCategories} from '../api/v2'
import MainLayout from '../components/Layouts/MainLayout'
import Storage from '../stores/Storage'

export default function Home() {
  return <MainLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const {query} = ctx
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
  const {action, id, email, code, success} = query
  let showSuccessAlert = ''
  let showErrorAlert = ''
  if (action && id && email && code) {
    const response =
      (await checkCode(
        {type: AuthType.email, email: email as string},
        VerifyMode.Email,
        code as string,
        storage,
      )) || {}
    // @ts-ignore
    const {access, hash, refresh} = response?.result?.newAuth || {}
    // @ts-ignore
    const {promo} = response?.result?.oldAuth || {}
    // setCookiesObject({access, hash, refresh, promo}, ctx)
    if (access && hash && refresh && promo) {
      showSuccessAlert = 'ACCOUNT_ACTIVATED'
    } else {
      showErrorAlert = 'CODE_NOT_CORRECT'
    }
  }
  if (success) {
    showSuccessAlert = success as string
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
          showSuccessAlert,
          showErrorAlert,
          locationCodes: getLocationCodes(ctx),
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
