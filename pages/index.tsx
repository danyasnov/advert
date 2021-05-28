import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import RestApi, {defaultFilter} from 'front-api'
import Layout from '../components/Layout'
import {storage} from '../stores/Storage'
import CategoriesSlider from '../components/CategoriesSlider'
import ProductsSlider from '../components/ProductsSlider'
import {DummyAnalytics} from '../helpers'

export default function Home() {
  return (
    <Layout>
      <CategoriesSlider />
      <ProductsSlider />
    </Layout>
  )
}

export const getServerSideProps = async ({locale}) => {
  let categoriesData
  let productsData
  let countriesData
  try {
    productsData = await globalRestApi.advertises.fetchList({
      page: 1,
      limit: 40,
      searchId: '',
      filter: {
        ...defaultFilter(storage),
        withPhoto: true,
        priceMin: '0',
        priceMax: '0',
      },
    })
    countriesData = await globalRestApi.oldRest.fetchCountries()
    categoriesData = await globalRestApi.categories.fetchTree()
  } catch (e) {
    console.error(e)
  }

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories: categoriesData?.result ?? [],
        },
        productsStore: {
          products: productsData?.result ?? [],
        },
        countriesStore: {
          countries: countriesData ?? [],
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}

export const globalRestApi = new RestApi({
  isDev: false,
  storage,
  isLogEnabled: false,
  isLogRequest: true,
  isLogResponse: false,
  analyticsService: new DummyAnalytics(),
})
