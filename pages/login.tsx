import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {GetServerSideProps} from 'next'
import localforage from 'localforage'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {
  clearCookies,
  destroyCookiesWrapper,
  getLocationCodes,
  processCookies,
} from '../helpers'
import LoginModal from '../components/Auth/Login/LoginModal'
import {fetchCountries} from '../api/v1'

export default function Home() {
  const {query, push} = useRouter()
  useEffect(() => {
    clearCookies()
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
  const promises = [fetchCountries(state.language)]
  const [countriesData] = await Promise.allSettled(promises).then((res) =>
    res.map((p) => (p.status === 'fulfilled' ? p.value : p.reason)),
  )
  const countries = countriesData ?? null

  return {
    props: {
      hydrationData: {
        countriesStore: {
          countries,
        },
        generalStore: {
          locationCodes: getLocationCodes(ctx),
          language: state.language,
        },
      },
      ...(await serverSideTranslations(state.language)),
    },
  }
}
