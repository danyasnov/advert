import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {
  getLocationCodes,
  getStorageFromCookies,
  processCookies,
  redirectToLogin,
} from '../helpers'
import {activateWithCode, fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import SupportLayout from '../components/Layouts/SupportLayout'

export default function Home() {
  return <SupportLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const storage = getStorageFromCookies(ctx)

  const promises = [fetchCountries(state.language), fetchCategories(storage)]

  const [countriesData, categoriesData] = await Promise.allSettled(
    promises,
  ).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  if (categoriesData.status === 401) {
    return redirectToLogin(ctx.resolvedUrl)
  }
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
