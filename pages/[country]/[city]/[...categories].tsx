import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {findCategoryByQuery, processCookies} from '../../../helpers'
import Storage from '../../../stores/Storage'
import {getRest} from '../../../api'
import {fetchProducts} from '../../../api/v2'
import {getCountries} from '../../../api/v1'

export default function Home() {
  return <CategoriesLayout />
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
    fetchProducts(state, {categoryId: currentCategory.id}, {limit: 40}),
    getCountries(locale),
  ]

  if (!currentCategory.items.length) {
    // @ts-ignore
    promises.push(rest.categories.fetchCategoryData(currentCategory.id))
  }

  const [productsResponse, countriesData, categoryData] =
    await Promise.allSettled(promises).then((res) =>
      res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
    )
  const productsStore = {
    // @ts-ignore
    products: productsResponse?.data?.data ?? null,
    // @ts-ignore
    count: productsResponse?.data?.headers.pagination.count,
    // @ts-ignore
    page: productsResponse?.data?.headers.pagination.page,
    // @ts-ignore
    limit: productsResponse?.data?.headers.pagination.limit,
    // @ts-ignore
    cacheId: productsResponse?.data?.headers.cacheId,
  }
  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
          // @ts-ignore
          categoryData: categoryData?.result ?? null,
        },
        productsStore,
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}
