import {GetServerSideProps} from 'next'
import {useEffect} from 'react'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {setCookiesObject} from '../helpers'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

export default function Home() {
  const router = useRouter()
  const {push, query} = router

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()

    makeRequest({
      url: '/api/refresh',
      method: 'post',
      data: {
        authNewRefreshToken: state.authNewRefreshToken,
      },
    }).then((res) => {
      const {newAuth} = res.data
      console.log(newAuth)
      if (newAuth) {
        setCookiesObject({
          authNewToken: newAuth.access,
          authNewRefreshToken: newAuth.refresh,
        })
        push((query.from as string) || '/')
      }
    })
  }, [])
  return null
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
