import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {head} from 'lodash'
import {useTranslation} from 'next-i18next'
import {
  checkToken,
  getQueryValue,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../../helpers'
import {fetchCountries} from '../../api/v1'
import {fetchCategories} from '../../api/v2'
import LocationContents from '../../components/Layouts/LocationContents'
import {fetchCitiesByCountryCode} from '../../api/db'
import {City} from '../../types'
import Storage from '../../stores/Storage'

export default function Home() {
  const {t} = useTranslation()

  return <LocationContents subtitle={t('ALL_CITIES')} />
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
  const countryCode = getQueryValue(query, 'countryCode')
  const countries = await fetchCountries(state.language)
  const promises = [fetchCategories(storage)]
  const cities = await fetchCitiesByCountryCode(countryCode, state.language)
  const [categoriesData] = await Promise.allSettled(promises).then((response) =>
    response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null
  const citiesByAlphabet = cities.reduce((acc, value) => {
    if (value.has_adverts === '0') return acc
    const result: City & {href: string} = {
      ...value,
      href: `/${countryCode}/${value.slug}`,
    }
    if (acc[head(result.word)]) {
      acc[head(result.word)].push(result)
    } else {
      acc[head(result.word)] = [result]
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
          locationsByAlphabet: citiesByAlphabet,
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
