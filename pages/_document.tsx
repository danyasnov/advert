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
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap'
            rel='stylesheet'
          />
          <meta name='format-detection' content='telephone=no' />
          <meta name='apple-itunes-app' content='app-id=1287862488' />
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
          <link rel='manifest' href='/manifest.json' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#FF9514' />
          <meta name='theme-color' content='#FF9514' />
          <link
            href='https://adverto.sale/inc/opensearch.xml'
            rel='search'
            type='application/opensearchdescription+xml'
            title='Adverto Search'
          />

          <noscript>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              height='1'
              width='1'
              style={{display: 'none'}}
              src='https://www.facebook.com/tr?id=1735830353144099&ev=PageView&noscript=1'
            />
          </noscript>

          <script
            async
            src='https://www.googletagmanager.com/gtag/js?id=UA-131255061-3'
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'UA-131255061-3');`),
            }}
          />
          <script
            type='text/javascript'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(`(function (d, w, c) {
  (w[c] = w[c] || []).push(function () {
    try {
      w.yaCounter46964940 = new Ya.Metrika({
        id: 46964940,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true,
        ecommerce: 'dataLayer',
      })
    } catch (e) {}
  })
  const n = d.getElementsByTagName('script')[0]
  const s = d.createElement('script')
  const f = function () {
    n.parentNode.insertBefore(s, n)
  }
  s.type = 'text/javascript'
  s.async = true
  s.src = 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/watch.js'
  if (w.opera == '[object Opera]') {
    d.addEventListener('DOMContentLoaded', f, false)
  } else {
    f()
  }
})(document, window, 'yandex_metrika_callbacks')`),
            }}
          />
          <noscript>
            <div>
              <img
                src='https://mc.yandex.ru/watch/46964940'
                style={{position: 'absolute', left: '-9999px'}}
                alt=''
              />
            </div>
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
