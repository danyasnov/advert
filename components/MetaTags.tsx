import {FC} from 'react'
import Head from 'next/head'
import {AdvertiseFullModel} from 'front-api/src/models/index'
import Script from 'next/script'

interface Props {
  title: string
  description?: string
  product?: AdvertiseFullModel
}
const MetaTags: FC<Props> = ({title, description, product}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description || title} />
        <meta name='twitter:card' content={title} />
        <meta property='og:title' content={title} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://adverto.sale/' />
        <meta
          property='og:image'
          content='https://adverto.sale/img/logo_playmarket.jpg'
        />
        <meta
          property='og:image:secure_url'
          content='https://adverto.sale/img/logo_playmarket.jpg'
        />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='512' />
        <meta property='og:image:height' content='512' />
        <meta property='og:description' content={description} />
        <meta name='apple-mobile-web-app-title' content={title} />
      </Head>
      {product ? (
        <>
          <Script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'Product',
                name: product.title,
                description: product.description,
                image: product.images,
                offers: {
                  '@type': 'Offer',
                  // @ts-ignore
                  price: product.priceFloat,
                  // @ts-ignore
                  priceCurrency: product.currencyCode,
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://adverto.sale/all/all?q={search_query}',
                  'query-input': 'required name=search_query',
                },
              }),
            }}
          />
          <Script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1735830353144099');
  fbq('track', 'PageView');
  fbq('track', 'ViewContent', {
  content_name: '${product.title}',
  content_ids: ['${product.hash}'],
  content_type: 'product',
  value: ${
    // @ts-ignore
    product.priceFloat
  },
  currency: '${
    // @ts-ignore
    product.currencyCode
  }'
});`,
            }}
          />
        </>
      ) : (
        <>
          <Script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1735830353144099');
            fbq('track', 'PageView');`,
            }}
          />
          <Script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'WebSite',
                url: 'https://adverto.sale',
                name: title,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://adverto.sale/all/all?q={search_query}',
                  'query-input': 'required name=search_query',
                },
              }),
            }}
          />
        </>
      )}
      <Script src='https://www.googletagmanager.com/gtag/js?id=UA-131255061-3' />
      <Script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'UA-131255061-3');`,
        }}
      />
      <Script
        type='text/javascript'
        dangerouslySetInnerHTML={{
          __html: `(function (d, w, c) {
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
})(document, window, 'yandex_metrika_callbacks')`,
        }}
      />
    </>
  )
}
export default MetaTags
