import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import AdvertWizardLayout from '../../components/Layouts/AdvertWizardLayout'
import {processCookies} from '../../helpers'
import {fetchCategories} from '../../api/v2'
import {fetchLanguages} from '../../api/v1'

export default function Home() {
  return <AdvertWizardLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  const promises = [
    fetchCategories(state.language),
    fetchLanguages(state.language),
  ]

  const [categoriesData, languagesData] = await Promise.allSettled(
    promises,
  ).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const categories = categoriesData?.result ?? null
  const languages = languagesData?.result ?? null
  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },

        generalStore: {
          languages,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
