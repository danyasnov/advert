import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
// import {getLocationCodes, processCookies} from '../helpers'
// import {activateWithCode, fetchCountries} from '../api/v1'
// import {fetchCategories} from '../api/v2'
// import MainLayout from '../components/Layouts/MainLayout'
import AdvertWizardLayout from '../../components/Layouts/AdvertWizardLayout'
import {processCookies} from '../../helpers'
import {fetchCategories} from '../../api/v2'
import {fetchLanguages} from '../../api/v1'

export default function Home() {
  return <AdvertWizardLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)
  const {query} = ctx
  // const {action, id, email, code, success} = query
  // let showSuccessAlert = ''
  // let showErrorAlert = ''
  // if (action && id && email && code) {
  //   const result = await activateWithCode(code as string, id as string)
  //   const {promo, hash} = result?.result || {}
  //   if (promo && hash) {
  //     showSuccessAlert = 'ACCOUNT_ACTIVATED'
  //   } else {
  //     showErrorAlert = 'CODE_NOT_CORRECT'
  //   }
  // }
  // if (success) {
  //   showSuccessAlert = success as string
  // }
  //

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
  //
  // const countries = countriesData ?? null
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
