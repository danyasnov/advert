import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {
  getLocationCodes,
  getStorageFromCookies,
  processCookies,
  redirectToLogin,
} from '../../helpers'
import {fetchCategories} from '../../api/v2'
import {fetchDocuments} from '../../api/db'
import {fetchCountries} from '../../api/v1'
import DocumentLayout from '../../components/Layouts/DocumentLayout'

export default function Home() {
  return <DocumentLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const state = await processCookies(ctx)
  const param = (query.document as string[]).join('/')
  const storage = getStorageFromCookies(ctx)

  const promises = [
    fetchCountries(state.language),
    fetchCategories(storage),
    fetchDocuments(param, state.language),
  ]
  const [countriesData, categoriesData, doc] = await Promise.allSettled(
    promises,
  ).then((response) =>
    response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  if (
    categoriesData.status === 401 &&
    !['terms-and-conditions', 'privacy-policy'].includes(param)
  ) {
    return redirectToLogin(ctx.resolvedUrl)
  }
  const categories = categoriesData?.result ?? null
  const countries = countriesData ?? null

  const document = doc[0]
  if (
    !document &&
    !['terms-and-conditions', 'privacy-policy'].includes(param)
  ) {
    return {
      redirect: {
        destination: '/countries',
        permanent: true,
      },
    }
  }
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
          document: document || {},
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
