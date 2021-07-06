import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import CategoriesLayout from '../../../components/Layouts/CategoriesLayout'
import {findCategoryByQuery, processCookies} from '../../../helpers'
import Storage from '../../../stores/Storage'
import {getRest} from '../../../api'
import {fetchProducts} from '../../../api/v2'
import {getCountries} from '../../../api/v1'
import ProductLayout from '../../../components/Layouts/ProductLayout'

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
    const response = await rest.categories.fetchTree()
    categories = response?.result
  } catch (e) {
    console.error(e)
  }

  const currentCategory = findCategoryByQuery(query.categories, categories)

  let productPromise
  if (!currentCategory) {
    const productSlug = query.categories[query.categories.length - 1]
    if (typeof productSlug === 'string') {
      const chunks = productSlug.split('-')
      const hash = chunks[chunks.length - 1]
      productPromise = rest.advertises.fetchDetail(hash)
    }
  }

  const promises = [getCountries(state.language)]
  if (currentCategory) {
    promises.push(
      // @ts-ignore
      fetchProducts(state, {categoryId: currentCategory.id}),
      rest.categories.fetchCategoryData(currentCategory.id),
    )
  } else if (productPromise) {
    promises.push(productPromise)
  }

  const [countriesData, productsResponse, categoryData] =
    await Promise.allSettled(promises).then((res) =>
      res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
    )

  let productsStore
  const categoriesStore = {categories}
  if (currentCategory) {
    productsStore = {
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
      // @ts-ignore
      aggregatedFields: productsResponse?.data?.aggregatedFields,
      timestamp: Date.now(),
    }
    // @ts-ignore
    categoriesStore.categoryData = categoryData?.result ?? null
  } else if (productPromise) {
    productsStore = {
      // @ts-ignore
      product: productsResponse?.result ?? null,
      timestamp: Date.now(),
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
