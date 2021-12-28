import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {getLocationCodes, processCookies} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import ChatLayout from '../components/Layouts/ChatLayout'

export default function Home() {
  return <ChatLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const {query} = ctx
  const {action, id, email, code, success} = query

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
