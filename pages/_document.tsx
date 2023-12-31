import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name='format-detection' content='telephone=no' />
          {/* <meta name='apple-itunes-app' content='app-id=1287862488' /> */}
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta name='theme-color' content='#ffffff' />
          <link
            href='https://vooxee.com/inc/opensearch.xml'
            rel='search'
            type='application/opensearchdescription+xml'
            title='Vooxee Search'
          />

          {/* <noscript> */}
          {/*  /!* eslint-disable-next-line jsx-a11y/alt-text *!/ */}
          {/*  <img */}
          {/*    height='1' */}
          {/*    width='1' */}
          {/*    style={{display: 'none'}} */}
          {/*    src='https://www.facebook.com/tr?id=1735830353144099&ev=PageView&noscript=1' */}
          {/*  /> */}
          {/* </noscript> */}

          {/* <noscript> */}
          {/*  <div> */}
          {/*    <img */}
          {/*      src='https://mc.yandex.ru/watch/46964940' */}
          {/*      style={{position: 'absolute', left: '-9999px'}} */}
          {/*      alt='' */}
          {/*    /> */}
          {/*  </div> */}
          {/* </noscript> */}
        </Head>
        <body className='overflow-x-hidden'>
          <noscript>
            <iframe
              title='gtm'
              src='https://www.googletagmanager.com/ns.html?id=GTM-NNJ32XM'
              height='0'
              width='0'
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
