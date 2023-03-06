import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import AdvertWizardLayout from '../../../components/Layouts/AdvertWizardLayout'
import {
  checkToken,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../../../helpers'
import {fetchCategories} from '../../../api/v2'
import {fetchCountries, fetchLanguages} from '../../../api/v1'
import Storage from '../../../stores/Storage'

export default function Home() {
  return <AdvertWizardLayout />
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
  const promises = [
    fetchCountries(state.language),
    fetchCategories(storage),
    fetchLanguages(state.language),
  ]

  const [countriesData, categoriesData, languagesData] =
    await Promise.allSettled(promises).then((res) =>
      res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
    )

  const categories = categoriesData?.result ?? null
  const languages = languagesData?.result ?? null
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
          languages,
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
