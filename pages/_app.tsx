import '../styles/global.css'
import '../styles/loader.css'
import 'rc-slider/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {ToastContainer} from 'react-toastify'
import NProgress from 'nprogress'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
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
    // @ts-ignore
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
      <ToastContainer />
      <CookiesWarning />
    </RootStoreProvider>
  )
}

export default appWithTranslation(MyApp, i18n)
