import '../styles/global.css'
import '../styles/loader.css'
import 'rc-slider/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {ToastContainer} from 'react-toastify'
import {RootStoreProvider} from '../providers/RootStoreProvider'
import i18n from '../next-i18next.config'

function MyApp({Component, pageProps}: AppProps) {
  return (
    // @ts-ignore
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
      <ToastContainer />
    </RootStoreProvider>
  )
}

export default appWithTranslation(MyApp, i18n)
