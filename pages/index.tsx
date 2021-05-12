import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import RestApi from 'front-api'
import Layout from '../components/Layout'
import {storage} from '../stores/Storage'

export default function Home({res}) {
  console.log(res)
  return <Layout>Home</Layout>
}

export const getServerSideProps = async ({locale}) => {
  const res = await rest.fetchCategoriesTree()
  return {
    props: {
      res,
      ...(await serverSideTranslations(locale)),
    },
  }
}

const rest = new RestApi({storage, isDev: true})
