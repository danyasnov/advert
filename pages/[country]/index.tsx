import {GetServerSideProps} from 'next'
import {
  getQueryValue,
  processCookies,
  redirectToLogin,
  refreshToken,
  setCookiesObject,
} from '../../helpers'
import {fetchProductDetails} from '../../api/v2'
import Storage from '../../stores/Storage'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const param = getQueryValue(query, 'country')
  const state = await processCookies(ctx)

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
  // redirect from short url
  const response = await fetchProductDetails(storage, param)
  if (response.result) {
    const {url} = response.result.advert
    return {
      redirect: {
        destination: url,
        permanent: true,
      },
    }
  }
  return {
    redirect: {
      destination: '/countries',
      permanent: true,
    },
  }
}
