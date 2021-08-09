import {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {getLocationCodes, getQueryValue, processCookies} from '../../helpers'
import {fetchCategories, fetchProductDetails} from '../../api/v2'
import {fetchDocuments} from '../../api/db'
import {fetchCountries} from '../../api/v1'
import DocumentLayout from '../../components/Layouts/DocumentLayout'

const docPathsDict = {
  'terms-and-conditions': 'terms-and-conditions',
  'privacy-policy': 'privacy-policy',
  'general-requirements-for-adverts': 'general-requirements-for-adverts',
  'description-requirements-for-product-or-service':
    'description-requirements-for-product-or-service',
  'photo-requirements': 'photo-requirements',
  'prohibited-products-and-services': 'prohibited-products-and-services',
}
export default function Home() {
  return <DocumentLayout />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, res} = ctx
  const state = await processCookies(ctx)
  const param = getQueryValue(query, 'country')
  if (docPathsDict[param]) {
    const promises = [
      fetchCountries(state.language),
      fetchCategories(state.language),
      fetchDocuments(docPathsDict[param], state.language),
    ]
    const [countriesData, categoriesData, doc] = await Promise.allSettled(
      promises,
    ).then((response) =>
      response.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
    )
    const categories = categoriesData?.result ?? null
    const countries = countriesData ?? null

    const document = doc[0]
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
            locationCodes: getLocationCodes(ctx),
            document,
          },
        },
        ...(await serverSideTranslations(state.language)),
      },
    }
  }

  // redirect from short url
  const response = await fetchProductDetails(state, param)
  if (response.result) {
    const {url} = response.result.advert
    res.setHeader('location', url)
    res.statusCode = 302
    res.end()
  } else {
    throw new Error("can't find advert")
  }
  return {
    props: {},
  }
}
