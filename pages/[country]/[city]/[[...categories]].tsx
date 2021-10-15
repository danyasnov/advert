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
import {fetchCityOrRegionsBySlug} from '../../../api/db'

export default function Home({isProduct}) {
  return isProduct ? <ProductLayout /> : <CategoriesLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, resolvedUrl, res} = ctx
  let state = await processCookies(ctx)
  const countryCode = getQueryValue(query, 'country')
  const sortBy = getQueryValue(query, 'sortBy') ?? null
  const cityCode = getQueryValue(query, 'city')
  const countries = (await fetchCountries(state.language)) ?? null
  const locations = await fetchCityOrRegionsBySlug(
    countryCode,
    cityCode,
    state.language,
  )
  const isValidCountry = !!countries.find((c) => c.isoCode === countryCode)
  state = await withLocationQuery(state, query, {countries, locations})

  let categories
  try {
    const response = await fetchCategories(state.language)
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  let product

  try {
    // inconsistent url when go back in browser
    const fixedUrl = resolvedUrl.split('?')[0]
    const productRes = await fetchProductByUrl(state.language, fixedUrl)
    product = productRes.data?.data
  } catch (e) {
    console.log(e)
  }

  let similarProductsPromise
  let currentCategory
  let categoryData = null
  if (product) {
    similarProductsPromise = fetchProducts(state, {
      limit: 4,
      advHash: product.advert.hash,
      filter: defaultFilter,
    })
  } else {
    currentCategory = findCategoryByQuery(query.categories, categories)
    if (currentCategory) {
      categoryData =
        (await fetchCategoryData(state, currentCategory?.id))?.result ?? null
    } else if (
      (countryCode !== 'all' && !isValidCountry) ||
      (!currentCategory && query.categories)
    ) {
      return {
        redirect: {
          destination: '/countries',
          statusCode: 301,
        },
      }
    }
  }

  const promises: Promise<any>[] = []
  if (product) {
    promises.push(similarProductsPromise)
  } else {
    const filterQueryData =
      categoryData && getFilterFromQuery(query, categoryData)

    const filter: Partial<Filter> = filterQueryData || {}
    if (currentCategory?.id) {
      filter.categoryId = currentCategory.id
    }
    if (query.q) {
      filter.search = getQueryValue(query, 'q')
    }
    if (sortBy) {
      const [key, direction] = sortBy.split('-')
      filter.sort = {key, direction}
    }
    promises.push(fetchProducts(state, {filter}))
  }

  const response = await Promise.allSettled(promises).then((promiseRes) =>
    promiseRes.map((p) => (p.status === 'fulfilled' ? p.value : null)),
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
    const products = productsResponse?.result?.data ?? null
    productsStore = {
      // @ts-ignore
      products,
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
      // @ts-ignore
      hideDistanceSort: state.modified || false,
      sortBy,
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
          cities: locations,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
