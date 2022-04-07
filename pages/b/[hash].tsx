import {GetServerSideProps} from 'next'
import {getQueryValue} from '../../helpers'
import {
  addMetaToDeeplink,
  fetchFirebaseLink,
  incrementDeeplinkCounter,
} from '../../api/db'
import {CoverLink} from '../../types'
import {parseIp} from '../../api'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query, req} = ctx
  const hash = getQueryValue(query, 'hash')
  const link = (await fetchFirebaseLink(
    getQueryValue(query, 'hash'),
  )) as CoverLink[]

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
