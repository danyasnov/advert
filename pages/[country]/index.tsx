import {GetServerSideProps} from 'next'
import {getQueryValue, processCookies} from '../../helpers'
import {fetchProductDetails} from '../../api/v2'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, res} = ctx
  const state = await processCookies(ctx)
  const hash = getQueryValue(query, 'country')

  const response = await fetchProductDetails(state, hash)

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
