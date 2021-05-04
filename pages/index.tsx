import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import Layout from '../components/Layout'

export default function Home() {
  return <Layout>Home</Layout>
}

export const getServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
