import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {
  findCategoryByQuery,
  getQueryValue,
  processCookies,
} from '../../../helpers'
import {
  fetchCategories,
  fetchCategoryData,
  fetchProductByUrl,
  fetchProducts,
} from '../../../api/v2'
import {fetchCountries, fetchLanguages} from '../../../api/v1'
import ProductLayout from '../../../components/Layouts/ProductLayout'
import {defaultFilter} from '../../../utils'
import {Filter} from '../../../types'

export default function Home({isProduct}) {
  return isProduct ? <ProductLayout /> : <CategoriesLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, resolvedUrl} = ctx
  const state = await processCookies(ctx)

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
  if (product) {
    similarProductsPromise = fetchProducts(state, {
      limit: 4,
      advHash: product.advert.hash,
      filter: defaultFilter,
    })
  } else {
    currentCategory = findCategoryByQuery(query.categories, categories)
  }

  const promises: Promise<any>[] = [fetchCountries(state.language)]
  if (currentCategory || query.q) {
    const filter: Partial<Filter> = {}
    if (currentCategory?.id) {
      filter.categoryId = currentCategory.id
    }
    if (query.q) {
      filter.search = getQueryValue(query, 'q')
    }
    promises.push(fetchProducts(state, {filter}))
    if (currentCategory?.id) {
      promises.push(fetchCategoryData(state, currentCategory.id))
    }
  } else if (similarProductsPromise) {
    promises.push(similarProductsPromise)
  }

  const response = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
  )
  const [countriesData] = response

  let productsStore = {}
  const categoriesStore = {categories: categories ?? null}
  if (currentCategory || query.q) {
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
  } else if (product && similarProductsPromise) {
    const [, similarProductsResponse] = response

    productsStore = {
      // @ts-ignore
      product: product ?? null,
      similarProducts: similarProductsResponse?.result?.data ?? null,
    }
  }

  const countries = countriesData ?? null
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
