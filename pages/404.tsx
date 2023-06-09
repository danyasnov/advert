import {useTranslation} from 'next-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {processCookies} from '../helpers'
import NotFound from '../components/Layouts/NotFound'

export default function Custom404() {
  return <NotFound />
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
