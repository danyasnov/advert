import '../styles/global.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'
import {RootStoreProvider} from '../providers/RootStoreProvider'

function MyApp({Component, pageProps}: AppProps) {
  return (
    // @ts-ignore
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </RootStoreProvider>
  )
}

export default appWithTranslation(MyApp)
