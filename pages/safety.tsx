import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {processCookies} from '../helpers'
import SafetyLayout from '../components/Layouts/SafetyLayout'

export default function Home() {
  return <SafetyLayout />
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
