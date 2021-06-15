import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoryLayout from '../../../components/CategoryLayout'
import {findCategoryByQuery, processCookies} from '../../../helpers'
import Storage from '../../../stores/Storage'
import {getProducts, getRest} from '../../../api'
import Breadcrumbs from '../../../components/Breadcrumbs'
import CategoryBody from '../../../components/CategoryBody'

export default function Home() {
  return (
    <CategoryLayout>
      <Breadcrumbs />
      <CategoryBody />
    </CategoryLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {locale, query} = ctx
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

  let categories
  try {
    const response = await rest.categories.fetchTree()
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  const currentCategory = findCategoryByQuery(query.categories, categories)

  const promises = [
    getProducts(rest, storage, currentCategory),
    rest.oldRest.fetchCountries(),
    rest.categories.fetchCategoryData(23),
  ]

  const [productsData, countriesData, filters] = await Promise.allSettled(
    promises,
  ).then((res) => res.map((p) => (p.status === 'fulfilled' ? p.value : null)))
  // @ts-ignore
  const products = productsData?.result ?? null
  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        productsStore: {
          products,
        },
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}
