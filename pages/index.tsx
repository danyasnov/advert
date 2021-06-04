import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {parseCookies} from 'nookies'
import {GetServerSideProps} from 'next'
import Layout from '../components/Layout'
import CategoriesSlider from '../components/CategoriesSlider'
import ProductsSlider from '../components/ProductsSlider'
import {getFreeProducts, getLocationByIp, getRest, parseIp} from '../api'
import {Storage} from '../stores/Storage'
import {
  CookiesState,
  getShortAddress,
  SerializedCookiesState,
  setCookiesObject,
} from '../helpers'

export default function Home() {
  return (
    <Layout>
      <CategoriesSlider />
      <ProductsSlider />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {locale, req} = ctx
  const cookies: SerializedCookiesState = parseCookies(ctx)
  const state: CookiesState = {}

  let categoriesData = null
  let productsData = null
  let countriesData = null
  let locationByIp = null

  state.language = locale
  if (!cookies.userLocation) {
    try {
      const ip = parseIp(req)
      locationByIp = await getLocationByIp(ip)
      if (locationByIp.data?.data) {
        const {latitude, longitude} = locationByIp.data.data
        state.userLocation = {
          latitude,
          longitude,
        }
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    state.userLocation = JSON.parse(cookies.userLocation)
  }
  state.searchLocation =
    !cookies.searchLocation && state.userLocation
      ? state.userLocation
      : JSON.parse(cookies.searchLocation)

  state.searchRadius = cookies.searchRadius ? Number(cookies.searchRadius) : 25
  state.searchBy = cookies.searchBy ?? 'coords'

  if (cookies.countryId) state.countryId = Number(cookies.countryId)
  if (cookies.regionId) state.regionId = Number(cookies.regionId)
  if (cookies.cityId) state.cityId = Number(cookies.cityId)

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
  try {
    productsData = await getFreeProducts(storage)
    countriesData = await rest.oldRest.fetchCountries()
    categoriesData = await rest.categories.fetchTree()
  } catch (e) {
    console.error(e)
  }

  if (!cookies.address) {
    const position = await rest.geo.fetchPositionByGPS(state.userLocation)
    state.address = getShortAddress(position.result)
  }

  setCookiesObject(state, ctx)

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
