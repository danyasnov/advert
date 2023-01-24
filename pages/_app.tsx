import '../styles/global.css'
import '../styles/radio.css'
import '../styles/loader.css'
import '../styles/tooltip.css'
import 'rc-slider/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/bottomSheet.css'
import '../styles/font.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {ToastContainer} from 'react-toastify'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import {RootStoreProvider} from '../providers/RootStoreProvider'
import i18n from '../next-i18next.config'
import CookiesWarning from '../components/CookiesWarning'
import WithYandexMetrika from '../components/WithYandexMetrika'
import {startTracking} from '../helpers'
import Loading from '../components/Loading'
// import ChatListener from '../components/ChatListener'

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  })
  useEffect(() => {
    startTracking()

    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey || 1,
      }))
      startTracking()
    }
    const handleStop = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <WithYandexMetrika>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </Head>
      {/* @ts-ignore */}
      <RootStoreProvider hydrationData={pageProps.hydrationData}>
        <Loading
          isRouteChanging={state.isRouteChanging}
          key={state.loadingKey}
        />
        <div className={state.isRouteChanging ? 'blur-[2px]' : ''}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
          <ToastContainer
            style={{width: '100%'}}
            position='top-center'
            bodyClassName='font-sans text-body-14'
          />
          <CookiesWarning />
          {/* <ChatListener /> */}
        </div>
      </RootStoreProvider>
    </WithYandexMetrika>
  )
}

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(JSON.stringify(metric, undefined, 2))
  }
}
export default appWithTranslation(MyApp, i18n)
