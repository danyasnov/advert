import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import MobileAppPromo from '../components/Layouts/MobileAppPromo'
import {processCookies} from '../helpers'

export default function Home() {
  return <MobileAppPromo />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  return {
    props: {
      ...(await serverSideTranslations(state.language)),
    },
  }
}
