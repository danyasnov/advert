import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {processCookies} from '../helpers'
import {fetchCountries, fetchSearchSuggestion} from '../api/v1'
import {fetchCategories, fetchProducts} from '../api/v2'
import MainLayout from '../components/Layouts/MainLayout'

export default function Home() {
  return <MainLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  const promises = [
    fetchProducts(state),
    fetchProducts(state, {filter: {priceMax: 0}}),
    fetchProducts(state, {filter: {onlyDiscounted: true}}),
    fetchCountries(state.language),
    fetchCategories(state.language),
  ]
  //
  // let res
  // try {
  //   res = await fetchSearchSuggestion()
  // } catch (e) {
  //   res = e
  // }

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
  const products = productsResponse?.result?.data ?? null
  const freeProducts = freeProductsResponse?.result?.data ?? null
  const discountedProducts = discountedProductsResponse?.result?.data ?? null
  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        productsStore: {
          products,
          freeProducts,
          discountedProducts,
        },
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
