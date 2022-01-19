import '../styles/global.css'
import '../styles/radio.css'
import '../styles/loader.css'
import '../styles/tooltip.css'
import 'rc-slider/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
import '../styles/bottomSheet.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {ToastContainer} from 'react-toastify'
import NProgress from 'nprogress'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Head from 'next/head'
import {RootStoreProvider} from '../providers/RootStoreProvider'
import i18n from '../next-i18next.config'
import CookiesWarning from '../components/CookiesWarning'

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
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
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </Head>
      {/* @ts-ignore */}
      <RootStoreProvider hydrationData={pageProps.hydrationData}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <ToastContainer />
        <CookiesWarning />
      </RootStoreProvider>
    </>
  )
}

export default appWithTranslation(MyApp, i18n)
