import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {
  checkToken,
  getLocationCodes,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../../helpers'
import {fetchCategories} from '../../api/v2'
import {fetchDocuments} from '../../api/db'
import {fetchCountries} from '../../api/v1'
import DocumentLayout from '../../components/Layouts/DocumentLayout'
import Storage from '../../stores/Storage'

export default function Home() {
  return <DocumentLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const state = await processCookies(ctx)
  const param = (query.document as string[]).join('/')
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
  const publicDocs = [
    'terms-and-conditions',
    'privacy-policy',
    'cookies-policy',
  ]
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
  const categories = categoriesData?.result ?? null
  const countries = countriesData ?? null

  const document = publicDocs.includes(param) ? null : doc[0]
  if (!document && !publicDocs.includes(param)) {
    return {
      redirect: {
        destination: '/not-found',
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
