import {GetServerSideProps} from 'next'
import {getQueryValue, processCookies} from '../../helpers'
import {fetchProductDetails} from '../../api/v2'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const state = await processCookies(ctx)
  const param = getQueryValue(query, 'country')

  // redirect from short url
  const response = await fetchProductDetails(state, param)
  if (response.result) {
    const {url} = response.result.advert
    return {
      redirect: {
        destination: url,
        statusCode: 301,
      },
    }
  }
  return {
    redirect: {
      destination: '/countries',
      statusCode: 301,
    },
  }
}
