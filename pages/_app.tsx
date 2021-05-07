import '../styles/global.css'
import {AppProps} from 'next/app'
import {appWithTranslation} from 'next-i18next'

function MyApp({Component, pageProps}: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
