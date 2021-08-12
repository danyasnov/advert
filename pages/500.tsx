import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import DocumentLayout from '../components/Layouts/DocumentLayout'
import {getLocationCodes, processCookies} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'
import {fetchDocuments} from '../api/db'

export default function Home() {
  return <DocumentLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  const promises = [
    fetchCountries(state.language),
    fetchCategories(state.language),
    fetchDocuments('not_found'),
  ]
  const [countriesData, categoriesData, doc] = await Promise.allSettled(
    promises,
  ).then((response) =>
    response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null
  const countries = countriesData ?? null

  const document = doc[0]
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
          document,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
