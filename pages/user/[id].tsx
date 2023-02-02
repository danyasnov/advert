import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {fetchCountries} from '../../api/v1'
import {
  getLocationCodes,
  getQueryValue,
  processCookies,
  redirectToLogin,
  refreshToken,
  setCookiesObject,
} from '../../helpers'
import {fetchCategories, fetchUser, fetchUserSale} from '../../api/v2'
import UserLayout from '../../components/Layouts/UserLayout'
import Storage from '../../stores/Storage'

export default function Home() {
  return <UserLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, res} = ctx
  const state = await processCookies(ctx)
  const userId = getQueryValue(query, 'id')

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
  const promises = [
    fetchCountries(state.language),
    fetchCategories(storage),
    fetchUser(userId, storage),
    fetchUserSale({userId, page: 1}, storage),
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
        permanent: true,
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
          userHash: state.hash ?? '',
        },
        userStore,
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
