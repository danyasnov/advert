import {GetServerSideProps} from 'next'
import {getQueryValue, processCookies, redirect} from '../../helpers'
import {fetchProductDetails} from '../../api/v2'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, res} = ctx
  const state = await processCookies(ctx)
  const param = getQueryValue(query, 'country')

  // redirect from short url
  const response = await fetchProductDetails(state, param)
  if (response.result) {
    const {url} = response.result.advert
    return redirect(url, res)
  }
  throw new Error("can't find advert")
}
