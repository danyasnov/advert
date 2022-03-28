import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {getLocationCodes, processCookies} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import SafetyLayout from '../components/Layouts/SafetyLayout'

export default function Home() {
  return <SafetyLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  const promises = [
    fetchCountries(state.language),
    fetchCategories(state.language),
  ]

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
