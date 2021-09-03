import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {fetchUser, fetchCountries} from '../../api/v1'
import {
  getLocationCodes,
  getQueryValue,
  processCookies,
  redirect,
} from '../../helpers'
import {fetchCategories, fetchUserSale} from '../../api/v2'
import UserLayout from '../../components/Layouts/UserLayout'

export default function Home() {
  return <UserLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, res} = ctx
  const state = await processCookies(ctx)
  const userId = getQueryValue(query, 'id')

  const promises = [
    fetchCountries(state.language),
    fetchCategories(state.language),
    fetchUser(userId, state.language),
    fetchUserSale({userId, page: 1}, state.language),
  ]
  const [countriesData, categoriesData, userData, userSaleData] =
    await Promise.allSettled(promises).then((response) =>
      response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
    )

  const categories = categoriesData?.result ?? null
  const countries = countriesData ?? null
  const userStore = {
    user: userData?.result ?? null,
    userSale: {
      items: userSaleData?.result ?? [],
      cacheId: userSaleData?.headers?.cacheId ?? null,
      page: userSaleData?.headers?.pagination?.page ?? 1,
      limit: userSaleData?.headers?.pagination?.limit ?? 20,
      count: userSaleData?.headers?.pagination?.count ?? 0,
    },
  }

  if (!userData?.result)
    return {
      redirect: {
        destination: '/countries',
        permanent: false,
      },
    }

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        countriesStore: {
          countries,
        },
        generalStore: {
          locationCodes: getLocationCodes(ctx),
        },
        userStore,
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
