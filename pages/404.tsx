import {useTranslation} from 'next-i18next'
import {GetStaticProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import {processCookies} from '../helpers'
import NotFound from '../components/Layouts/NotFound'

export const getStaticProps: GetStaticProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default function NotFoundPage() {
  return <NotFound />
}
