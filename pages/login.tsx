import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import localforage from 'localforage'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {destroyCookiesWrapper, processCookies} from '../helpers'
import LoginModal from '../components/Auth/Login/LoginModal'

export default function Home() {
  const {query, push} = useRouter()
  useEffect(() => {
    destroyCookiesWrapper('hash')
    destroyCookiesWrapper('promo')
    destroyCookiesWrapper('authType')
    destroyCookiesWrapper('aup')
    destroyCookiesWrapper('authNewRefreshToken')
    destroyCookiesWrapper('authNewToken')
    localforage.clear()
  }, [])
  return (
    <LoginModal
      isOpen
      onClose={() => {
        push('/')
      }}
      onFinish={() => {
        push((query.from as string) || '/')
      }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  return {
    props: {
      ...(await serverSideTranslations(state.language)),
    },
  }
}
