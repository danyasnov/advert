import {GetServerSideProps} from 'next'
import {
  checkToken,
  getQueryValue,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
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
  const message = await checkToken(state.authNewToken)
  if (message === 'LOGIN_REDIRECT') {
    return redirectToLogin(ctx.resolvedUrl)
  }
  if (message === 'REFRESH_REDIRECT') {
    return redirectToRefresh(ctx.resolvedUrl)
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
      destination: '/not-found',
      permanent: true,
    },
  }
}
