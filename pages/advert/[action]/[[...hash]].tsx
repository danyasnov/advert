import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import AdvertWizardLayout from '../../../components/Layouts/AdvertWizardLayout'
import {getStorageFromCookies, processCookies} from '../../../helpers'
import {fetchCategories} from '../../../api/v2'
import {fetchCountries, fetchLanguages} from '../../../api/v1'

export default function Home() {
  return <AdvertWizardLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const storage = getStorageFromCookies(ctx)

  const promises = [
    fetchCountries(state.language),
    fetchCategories(storage),
    fetchLanguages(state.language),
  ]

  const [countriesData, categoriesData, languagesData] =
    await Promise.allSettled(promises).then((res) =>
      res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
    )

  if (categoriesData.status === 401) {
    return {
      redirect: {
        destination: `/login?from=${ctx.resolvedUrl}`,
        permanent: false,
      },
    }
  }
  const categories = categoriesData?.result ?? null
  const languages = languagesData?.result ?? null
  const countries = countriesData ?? null

  return {
    props: {
      hydrationData: {
        categoriesStore: {
          categories,
        },
        countriesStore: {
          countries,
        },
        generalStore: {
          languages,
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
