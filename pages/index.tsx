import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {getLocationCodes, processCookies, setCookiesObject} from '../helpers'
import {activateWithCode, fetchCountries} from '../api/v1'
import {fetchCategories, fetchProducts} from '../api/v2'
import MainLayout from '../components/Layouts/MainLayout'

export default function Home() {
  return <MainLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const {query} = ctx
  const {action, id, email, code, success} = query
  let showSuccessAlert = ''
  let showErrorAlert = ''
  if (action && id && email && code) {
    const result = await activateWithCode(code as string, id as string)
    const {promo, hash} = result?.result || {}
    if (promo && hash) {
      showSuccessAlert = 'ACCOUNT_ACTIVATED'
    } else {
      showErrorAlert = 'CODE_NOT_CORRECT'
    }
  }
  if (success) {
    showSuccessAlert = success as string
  }

  const promises = [
    fetchProducts(state),
    fetchProducts(state, {filter: {priceMax: 0}, limit: 10}),
    fetchProducts(state, {filter: {onlyDiscounted: true}, limit: 10}),
    fetchCountries(state.language),
    fetchCategories(state.language),
  ]

  const [
    productsResponse,
    freeProductsResponse,
    discountedProductsResponse,
    countriesData,
    categoriesData,
  ] = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null
  const productsStore = {
    freeProducts: freeProductsResponse?.result?.data ?? null,
    discountedProducts: discountedProductsResponse?.result?.data ?? null,
    products: productsResponse?.result?.data ?? null,
    count: productsResponse?.headers?.pagination.count ?? null,
    page: productsResponse?.headers?.pagination.page ?? null,
    limit: productsResponse?.headers?.pagination.limit ?? null,
    cacheId: productsResponse?.headers?.cacheId ?? null,
  }
  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        productsStore,
        countriesStore: {
          countries,
        },
        generalStore: {
          showSuccessAlert,
          showErrorAlert,
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
