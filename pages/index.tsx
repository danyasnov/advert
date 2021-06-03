import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import nookies from 'nookies'
import {GetServerSideProps} from 'next'
import Layout from '../components/Layout'
import CategoriesSlider from '../components/CategoriesSlider'
import ProductsSlider from '../components/ProductsSlider'
import {getFreeProducts, getLocationByIp, getRest, parseIp} from '../api'
import {Storage} from '../stores/Storage'

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
  const cookies = nookies.get(ctx)

  let categoriesData = null
  let productsData = null
  let countriesData = null
  let locationByIp = null
  let userLocation
  let searchLocation
  let searchRadius
  let countryId
  let regionId
  let cityId

  if (!cookies.language) {
    nookies.set(ctx, 'language', locale)
  }
  if (!cookies.userLocation) {
    try {
      const ip = parseIp(req)
      locationByIp = await getLocationByIp(ip)
      if (locationByIp.data?.data) {
        const {latitude, longitude} = locationByIp.data.data
        userLocation = {
          latitude,
          longitude,
        }
        nookies.set(ctx, 'userLocation', JSON.stringify(userLocation))
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    userLocation = JSON.parse(cookies.userLocation)
  }
  if (!cookies.searchLocation && userLocation) {
    searchLocation = userLocation
    nookies.set(ctx, 'searchLocation', JSON.stringify(searchLocation))
  } else {
    searchLocation = JSON.parse(cookies.searchLocation)
  }

  if (!cookies.searchRadius) {
    searchRadius = 25
    nookies.set(ctx, 'searchRadius', searchRadius)
  } else {
    searchRadius = Number(cookies.searchRadius)
  }

  if (cookies.countryId) countryId = Number(cookies.countryId)
  if (cookies.regionId) regionId = Number(cookies.regionId)
  if (cookies.cityId) cityId = Number(cookies.cityId)

  const storage = new Storage({
    language: locale,
    location: searchLocation,
    userLocation,
    searchRadius,
    countryId,
    regionId,
    cityId,
  })
  const rest = getRest(storage)
  try {
    productsData = await getFreeProducts(storage)
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
