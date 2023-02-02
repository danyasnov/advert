import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {isEmpty, last} from 'lodash'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {
  findCategoryByQuery,
  getFilterFromQuery,
  getLocationCodes,
  getQueryValue,
  processCookies,
  redirectToLogin,
  refreshToken,
  setCookiesObject,
  withLocationQuery,
} from '../../../helpers'
import {
  fetchCategories,
  fetchCategoryData,
  fetchProductByUrl,
  fetchProductDetails,
  fetchProducts,
} from '../../../api/v2'
import {fetchCountries} from '../../../api/v1'
import ProductLayout from '../../../components/Layouts/ProductLayout'
import {defaultFilter} from '../../../utils'
import {Filter} from '../../../types'
import {fetchCityOrRegionsBySlug} from '../../../api/db'
import Storage from '../../../stores/Storage'

export default function Home({isProduct}) {
  return isProduct ? <ProductLayout /> : <CategoriesLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, resolvedUrl, res} = ctx
  let state = await processCookies(ctx)
  const storage = new Storage({
    ...state,
    userHash: state.hash,
    location: state.searchLocation,
  })
  const newAuth = await refreshToken({
    authNewToken: state.authNewToken,
    authNewRefreshToken: state.authNewRefreshToken,
  })
  if (newAuth.authNewToken && newAuth.authNewRefreshToken) {
    storage.saveNewTokens({
      accessToken: newAuth.authNewToken,
      refreshToken: newAuth.authNewRefreshToken,
    })
    setCookiesObject(newAuth, ctx)
  } else if (newAuth.err === 'LOGIN_REDIRECT') {
    return redirectToLogin(ctx.resolvedUrl)
  }
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
  state = withLocationQuery(state, query, {countries, locations})

  let categories
  try {
    const response = await fetchCategories(storage)
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  let product

  try {
    const splited = resolvedUrl.split('_')
    let productRes

    if (splited.length > 1) {
      productRes = await fetchProductDetails(storage, last(splited))
      product = productRes.result
    } else {
      // inconsistent url when go back in browser
      const fixedUrl = resolvedUrl.split('?')[0]
      // debugger
      if (fixedUrl.includes('_')) {
        productRes = await fetchProductByUrl(
          state.language,
          fixedUrl,
          state.hash,
        )
        product = productRes.data?.data
      }
    }
  } catch (e) {
    console.log(e)
  }

  let similarProductsPromise
  let currentCategory
  let categoryData = null
  if (product) {
    similarProductsPromise = fetchProducts(
      state,
      {
        limit: 4,
        advHash: product.advert.hash,
        filter: defaultFilter,
      },
      storage,
    )
  } else {
    currentCategory = findCategoryByQuery(query.categories, categories)
    if (currentCategory) {
      categoryData =
        (await fetchCategoryData(storage, currentCategory?.id))?.result ?? null
    } else if (
      (countryCode !== 'all' && !isValidCountry) ||
      (!currentCategory && query.categories)
    ) {
      return {
        redirect: {
          destination: '/countries',
          permanent: true,
        },
      }
    }
  }

  let filter: Partial<Filter> = {}
  const promises: Promise<any>[] = []
  if (product) {
    promises.push(similarProductsPromise)
  } else {
    const filterQueryData = getFilterFromQuery(query, categoryData)

    filter = filterQueryData || {}
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

    promises.push(fetchProducts(state, {filter}, storage))
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
      count: productsResponse?.headers?.pagination.count ?? null,
      // @ts-ignore
      page: productsResponse?.headers?.pagination.page ?? null,
      // @ts-ignore
      limit: productsResponse?.headers?.pagination.limit ?? null,
      // @ts-ignore
      cacheId: productsResponse?.headers?.cacheId ?? null,
      // @ts-ignore
      aggregatedFields: productsResponse?.result?.aggregatedFields ?? null,
      // @ts-ignore
      hideDistanceSort: state.modified || false,
      filter,
      sortBy,
    }
    // debugger
    if (isEmpty(products)) {
      res.statusCode = 404
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
        generalStore: {
          isProduct: !!product,
          userHash: state.hash ?? '',
          language: state.language,
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
