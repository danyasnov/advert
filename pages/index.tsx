import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import RestApi from 'front-api'
import Layout from '../components/Layout'
import {storage} from '../stores/Storage'
import CategoriesSlider from '../components/CategoriesSlider'

export default function Home() {
  return (
    <Layout>
      <CategoriesSlider />
    </Layout>
  )
}

export const getServerSideProps = async ({locale}) => {
  const data = await globalRestApi.categories.fetchTree()
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories: data.result,
        },
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}

export const globalRestApi = new RestApi({
  isDev: false,
  storage,
})
