import {GetServerSideProps} from 'next'
import {isEmpty} from 'lodash'
import {getQueryValue, processCookies} from '../../helpers'
import {
  addMetaToDeeplink,
  fetchFirebaseLink,
  incrementDeeplinkCounter,
} from '../../api/db'
import {CoverLink} from '../../types'
import {parseIp} from '../../api'
import {fetchProductDetails} from '../../api/v2'
import Storage from '../../stores/Storage'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, req} = ctx
  const state = await processCookies(ctx)
  const storage = new Storage({
    ...state,
    userHash: state.hash,
    location: state.searchLocation,
  })
  const hash = getQueryValue(query, 'hash')
  const link = (await fetchFirebaseLink(hash)) as CoverLink[]
  if (isEmpty(link)) {
    const productRes = await fetchProductDetails(storage, hash)
    const product = productRes.result
    if (product?.advert?.url) {
      return {
        redirect: {
          destination: product.advert.url,
          permanent: true,
        },
      }
    }
  }

  const ip = parseIp(req)
  const referrer = req.headers.referer || ''
  const userAgent = req.headers['user-agent'] || ''

  try {
    incrementDeeplinkCounter(hash)
    addMetaToDeeplink(hash, ip, referrer, userAgent)
  } catch (e) {
    console.error(e)
  }

  return {
    redirect: {
      destination: link[0]?.firebase_link || '/countries',
      permanent: true,
    },
  }
}
