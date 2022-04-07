import {GetServerSideProps} from 'next'
import {
  getQueryValue,
  getStorageFromCookies,
  processCookies,
} from '../../helpers'
import {fetchProductDetails} from '../../api/v2'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const param = getQueryValue(query, 'country')
  const storage = getStorageFromCookies(ctx)

  // redirect from short url
  const response = await fetchProductDetails(storage, param)
  if (response.result) {
    const {url} = response.result.advert
    return {
      redirect: {
        destination: url,
        permanent: true,
      },
    }
  }
  return {
    redirect: {
      destination: '/countries',
      permanent: true,
    },
  }
}
