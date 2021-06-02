import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {defaultFilter} from 'front-api'
import Layout from '../components/Layout'
import CategoriesSlider from '../components/CategoriesSlider'
import ProductsSlider from '../components/ProductsSlider'
import {getRest} from '../api'
import {Storage} from '../stores/Storage'

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
  const storage = new Storage({language: locale})
  const rest = getRest(storage)
  try {
    productsData = await rest.advertises.fetchList({
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
    countriesData = await rest.oldRest.fetchCountries()
    categoriesData = await rest.categories.fetchTree()
  } catch (e) {
    console.error(e)
  }

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories: categoriesData?.result,
        },
        productsStore: {
          products: productsData?.result,
        },
        countriesStore: {
          countries: countriesData,
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}
