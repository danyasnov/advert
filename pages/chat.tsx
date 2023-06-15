import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {
  checkToken,
  getLocationCodes,
  processCookies,
  redirectToLogin,
  redirectToRefresh,
} from '../helpers'
import ChatLayout from '../components/Layouts/ChatLayout'

export default function Home() {
  return <ChatLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  const message = await checkToken(state.authNewToken)
  if (message === 'LOGIN_REDIRECT') {
    return redirectToLogin(ctx.resolvedUrl)
  }
  if (message === 'REFRESH_REDIRECT') {
    return redirectToRefresh(ctx.resolvedUrl)
  }

  return {
    props: {
      hydrationData: {
        generalStore: {
          locationCodes: getLocationCodes(ctx),
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
