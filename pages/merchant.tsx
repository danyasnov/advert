import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {getStorageFromCookies, processCookies} from '../helpers'
import MerchantLayout from '../components/Layouts/MerchantLayout'
import {fetchCountries} from '../api/v1'
import {fetchCategories} from '../api/v2'

export default function Home() {
  return <MerchantLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const storage = getStorageFromCookies(ctx)

  const promises = [fetchCountries(state.language), fetchCategories(storage)]

  const [countriesData, categoriesData] = await Promise.allSettled(
    promises,
  ).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  if (categoriesData.status === 401) {
    return {
      redirect: {
        destination: `/login?from=${ctx.resolvedUrl}`,
        permanent: false,
      },
    }
  }
  const categories = categoriesData?.result ?? null

  const countries = countriesData ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        countriesStore: {
          countries,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
