import {GetServerSideProps} from 'next'
import {getQueryValue} from '../../helpers'
import {fetchFirebaseLink} from '../../api/db'
import {CoverLink} from '../../types'
import config from '../../config.json'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const link = (await fetchFirebaseLink(
    getQueryValue(query, 'hash'),
  )) as CoverLink[]
  console.log(
    'fetchFirebaseLink',
    getQueryValue(query, 'hash'),
    link,
    config.host,
    config.database,
  )

  return {
    redirect: {
      destination: link[0]?.firebase_link || '/countries',
      statusCode: 301,
    },
  }
}
