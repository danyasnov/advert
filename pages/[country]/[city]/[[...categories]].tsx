import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {findCategoryByQuery, processCookies} from '../../../helpers'
import Storage from '../../../stores/Storage'
import {getRest} from '../../../api'
import {
  fetchCategories,
  fetchCategoryData,
  fetchProductDetails,
  fetchProducts,
} from '../../../api/v2'
import {fetchCountries} from '../../../api/v1'
import ProductLayout from '../../../components/Layouts/ProductLayout'
import {defaultFilter} from '../../../utils'

export default function Home({isProduct}) {
  return isProduct ? <ProductLayout /> : <CategoriesLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const state = await processCookies(ctx)

  const storage = new Storage({
    language: state.language,
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
    const response = await fetchCategories(state.language)
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  const currentCategory = findCategoryByQuery(query.categories, categories)

  let productPromise
  let similarProductsPromise
  if (!currentCategory) {
    const productSlug = query.categories[query.categories.length - 1]
    if (typeof productSlug === 'string') {
      const chunks = productSlug.split('-')
      const hash = chunks[chunks.length - 1]
      productPromise = fetchProductDetails(state, hash)
      similarProductsPromise = fetchProducts(state, {
        limit: 4,
        advHash: hash,
        filter: defaultFilter,
      })
    }
  }

  let promises: Promise<any>[] = []
  if (currentCategory) {
    promises = [
      fetchCountries(state.language),
      fetchProducts(state, {filter: {categoryId: currentCategory.id}}),
      fetchCategoryData(state, currentCategory.id),
    ]
  } else if (productPromise) {
    promises = [
      fetchCountries(state.language),
      productPromise,
      similarProductsPromise,
    ]
  }

  const response = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
  )
  const [countriesData] = response

  let productsStore
  const categoriesStore = {categories}
  if (currentCategory) {
    const [, productsResponse, categoryData] = response
    productsStore = {
      // @ts-ignore
      products: productsResponse?.result?.data ?? null,
      // @ts-ignore
      count: productsResponse?.headers?.pagination.count,
      // @ts-ignore
      page: productsResponse?.headers?.pagination.page,
      // @ts-ignore
      limit: productsResponse?.headers?.pagination.limit,
      // @ts-ignore
      cacheId: productsResponse?.headers?.cacheId,
      // @ts-ignore
      aggregatedFields: productsResponse?.result?.aggregatedFields,
    }
    // @ts-ignore
    categoriesStore.categoryData = categoryData?.result ?? null
  } else if (productPromise) {
    const [, productsResponse, similarProductsResponse] = response

    productsStore = {
      // @ts-ignore
      product: productsResponse?.result ?? null,
      similarProducts: similarProductsResponse?.result?.data ?? null,
    }
  }

  const countries = countriesData ?? null
  return {
    props: {
      isProduct: !!productPromise,
      hydrationData: {
        categoriesStore,
        productsStore,
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
