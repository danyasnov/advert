import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {FilterPublication} from 'front-api/src/models/index'
import {getRest} from '../api'
import Storage from '../stores/Storage'
import {processCookies} from '../helpers'
import {getCountries} from '../api/v1'
import {fetchProducts} from '../api/v2'
import MainLayout from '../components/Layouts/MainLayout'

export default function Home() {
  return <MainLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {locale} = ctx
  const state = await processCookies(ctx)

  const storage = new Storage({
    language: locale,
    location: state.searchLocation,
    userLocation: state.userLocation,
    searchRadius: state.searchRadius,
    countryId: state.countryId,
    regionId: state.regionId,
    cityId: state.cityId,
    searchBy: state.searchBy,
  })
  const rest = getRest(storage)
  const promises = [
    // @ts-ignore
    fetchProducts(state),
    fetchProducts(state, {priceMax: 0}),
    getCountries(locale),
    rest.categories.fetchTree(),
  ]

  // const details = await rest.advertises.fetchDetail('e7MKFg')

  // const searchResults = await rest.advertises.fetchList({
  //   filter: {
  //     onlyFromSubscribed: false,
  //     published: FilterPublication.ALL_TIME,
  //     priceMax: undefined,
  //     priceMin: undefined,
  //     fieldValues: new Map(),
  //     search: '',
  //     onlyDiscounted: false,
  //     secureDeal: false,
  //     sort: {
  //       type: 'date_published',
  //       direction: 'asc',
  //       key: '',
  //     },
  //   },
  // })

  const [
    productsResponse,
    freeProductsResponse,
    countriesData,
    categoriesData,
  ] = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  // @ts-ignore
  const categories = categoriesData?.result ?? null
  // @ts-ignore
  const products = productsResponse?.data?.data ?? null
  const freeProducts = freeProductsResponse?.data?.data ?? null
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
        },
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}
