import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {getLocationCodes, processCookies} from '../helpers'
import {fetchCountries} from '../api/v1'
import {fetchCategories, fetchProducts} from '../api/v2'
import MainLayout from '../components/Layouts/MainLayout'

export default function Home() {
  return <MainLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

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
    count: productsResponse?.headers?.pagination.count,
    page: productsResponse?.headers?.pagination.page,
    limit: productsResponse?.headers?.pagination.limit,
    cacheId: productsResponse?.headers?.cacheId,
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
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
