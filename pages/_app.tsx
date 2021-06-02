import '../styles/global.css'
import 'rc-slider/assets/index.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {CookiesProvider, useCookies} from 'react-cookie'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {RootStoreProvider} from '../providers/RootStoreProvider'
import {makeRequest} from '../api'

function MyApp({Component, pageProps}: AppProps) {
  const [cookie, setCookie] = useCookies(['userLocation', 'language'])
  const router = useRouter()

  useEffect(() => {
    if (!cookie.language || cookie.language !== router.locale)
      setCookie('language', router.locale)
    if (!cookie.userLocation) {
      makeRequest({
        method: 'get',
        url: '/api/mylocation',
      }).then(({data: {data}}) => {
        const location = {lat: data.latitude, lng: data.longitude}
        setCookie('userLocation', JSON.stringify(location))
      })
    }
  }, [])
  return (
    <CookiesProvider>
      {/* @ts-ignore */}
      <RootStoreProvider hydrationData={pageProps.hydrationData}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </RootStoreProvider>
    </CookiesProvider>
  )
}

export default appWithTranslation(MyApp)
