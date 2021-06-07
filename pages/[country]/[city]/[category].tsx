import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import Layout from '../../../components/Layout'
import {processCookies} from '../../../helpers'
import {Storage} from '../../../stores/Storage'
import {getFreeProducts, getRest} from '../../../api'
import Breadcrumbs from '../../../components/Breadcrumbs'

export default function Home() {
  return (
    <Layout>
      <Breadcrumbs />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {locale} = ctx
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
  const promises = [
    getFreeProducts(storage),
    rest.oldRest.fetchCountries(),
    rest.categories.fetchTree(),
  ]

  const [
    productsData,
    countriesData,
    categoriesData,
  ] = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : null)),
  )
  // @ts-ignore
  const categories = categoriesData?.result
  // @ts-ignore
  const products = productsData?.result
  const countries = countriesData
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
