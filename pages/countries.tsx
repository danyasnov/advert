import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {head, isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import {CountryModel} from 'front-api'
import LocationContents from '../components/Layouts/LocationContents'
import {
  checkToken,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import Storage from '../stores/Storage'

export default function Home() {
  const {t} = useTranslation()

  return <LocationContents subtitle={t('ALL_COUNTRIES')} />
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
  const promises = [fetchCategories(storage), fetchCountries(state.language)]
  const [categoriesData, countries] = await Promise.allSettled(promises).then(
    (response) =>
      response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )

  const categories = categoriesData?.result ?? null
  let countriesByAlphabet = null
  countriesByAlphabet = countries.reduce((acc, value) => {
    if (value.has_adverts === '0') return acc
    const result: CountryModel & {href: string} = {
      ...value,
      href: `/cities/${value.isoCode}`,
    }
    if (acc[head(result.title)]) {
      acc[head(result.title)].push(result)
    } else {
      acc[head(result.title)] = [result]
    }
    return acc
  }, {})

  // eslint-disable-next-line consistent-return
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        countriesStore: {
          countries,
          locationsByAlphabet: countriesByAlphabet,
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
