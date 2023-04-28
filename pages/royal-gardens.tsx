import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {processCookies} from '../helpers'
import RoyalGardens from '../components/Layouts/RoyalGardens'

export default function Home() {
  return <RoyalGardens />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  return {
    props: {
      hydrationData: {},
      ...(await serverSideTranslations(state.language)),
    },
  }
}
