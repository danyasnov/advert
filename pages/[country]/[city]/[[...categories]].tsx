import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {
  findCategoryByQuery,
  getFilterFromQuery,
  getQueryValue,
  processCookies,
  withLocationQuery,
} from '../../../helpers'
import {
  fetchCategories,
  fetchCategoryData,
  fetchProductByUrl,
  fetchProducts,
} from '../../../api/v2'
import {fetchCountries} from '../../../api/v1'
import ProductLayout from '../../../components/Layouts/ProductLayout'
import {defaultFilter} from '../../../utils'
import {Filter} from '../../../types'
import {
  fetchCitiesByCountryCode,
  fetchRegionsByCountryCode,
} from '../../../api/db'

export default function Home({isProduct}) {
  return isProduct ? <ProductLayout /> : <CategoriesLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, resolvedUrl} = ctx
  let state = await processCookies(ctx)
  const countryCode = getQueryValue(query, 'country')
  const countries = (await fetchCountries(state.language)) ?? null
  const cities = await fetchCitiesByCountryCode(countryCode, state.language)
  const regions = await fetchRegionsByCountryCode(countryCode, state.language)
  state = await withLocationQuery(state, query, {countries, cities, regions})

  let categories
  try {
    const response = await fetchCategories(state.language)
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  let product

  try {
    const productRes = await fetchProductByUrl(state.language, resolvedUrl)
    product = productRes.data?.data
  } catch (e) {
    console.log(e)
  }

  let similarProductsPromise
  let currentCategory
  let categoryData
  if (product) {
    similarProductsPromise = fetchProducts(state, {
      limit: 4,
      advHash: product.advert.hash,
      filter: defaultFilter,
    })
  } else {
    currentCategory = findCategoryByQuery(query.categories, categories)
    categoryData =
      (await fetchCategoryData(state, currentCategory?.id))?.result ?? null
  }

  const promises: Promise<any>[] = []
  if (product) {
    promises.push(similarProductsPromise)
  } else {
    const filterQueryData = getFilterFromQuery(query, categoryData)

    const filter: Partial<Filter> = filterQueryData || {}
    if (currentCategory?.id) {
      filter.categoryId = currentCategory.id
    }
    if (query.q) {
      filter.search = getQueryValue(query, 'q')
    }
    promises.push(fetchProducts(state, {filter}))
  }

  const response = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
  )

  let productsStore = {}
  const categoriesStore = {categories: categories ?? null}
  if (product && similarProductsPromise) {
    const [similarProductsResponse] = response

    productsStore = {
      // @ts-ignore
      product: product ?? null,
      similarProducts: similarProductsResponse?.result?.data ?? null,
    }
  } else {
    const [productsResponse] = response
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
    categoriesStore.categoryData = categoryData
  }

  return {
    props: {
      isProduct: !!product,
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
