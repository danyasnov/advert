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
  const categoriesData = await globalRestApi.categories.fetchTree()
  const productsData = await globalRestApi.advertises.fetchList({
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
  const countriesData = await globalRestApi.oldRest.fetchCountries()

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories: categoriesData.result ?? [],
        },
        productsStore: {
          products: productsData.result ?? [],
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
  analyticsService: new DummyAnalytics(),
})
