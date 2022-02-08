import {FC} from 'react'
import Head from 'next/head'
import {AdvertiseDetail, OwnerModel} from 'front-api/src/models'
import Script from 'next/script'
import {first} from 'lodash'
import {DateTime} from 'luxon'
import {useGeneralStore} from '../providers/RootStoreProvider'

interface Props {
  title: string
  description?: string
  product?: AdvertiseDetail
  user?: OwnerModel
}

const brandTitles = {
  Бренд: 1,
  Μάρκα: 1,
  Brand: 1,
  Marka: 1,
  Marca: 1,
}
const MetaTags: FC<Props> = ({title, description, product = {}, user}) => {
  const {advert, owner} = product
  const {language} = useGeneralStore()

  let yandexMetrikaId
  switch (language) {
    case 'ru':
      yandexMetrikaId = 'db8a14e599462c4c'
      break
    case 'el':
      yandexMetrikaId = '631377a5229beaf4'
      break
    case 'tr':
      yandexMetrikaId = '08426b2eedf287ce'
      break
    case 'ro':
      yandexMetrikaId = '3deab17f0179bbf6'
      break
    case 'uk':
      yandexMetrikaId = '2c9bed981a52783d'
      break
    default:
      yandexMetrikaId = 'ce08de680afab7c9'
  }
  const imageUrl = first(advert?.images) || user?.imageUrl
  let brand
  if (advert) {
    advert.fields.forEach((f) => {
      if (brandTitles[f.fieldNameText]) {
        // eslint-disable-next-line prefer-destructuring
        brand = f.fieldValueText[0]
      }
    })
  }
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description || title} />
        <meta name='twitter:card' content={title} />
        <meta property='og:title' content={title} />
        <meta property='og:type' content='website' />
        <meta name='yandex-verification' content={yandexMetrikaId} />
        <meta
          property='og:url'
          content={
            advert
              ? `https://adverto.sale${advert.url}`
              : 'https://adverto.sale'
          }
        />
        <meta
          property='og:image'
          content={imageUrl || 'https://adverto.sale/img/logo_playmarket.jpg'}
        />
        <meta
          property='og:image:secure_url'
          content={imageUrl || 'https://adverto.sale/img/logo_playmarket.jpg'}
        />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='512' />
        <meta property='og:image:height' content='512' />
        <meta
          property='og:description'
          content={advert ? advert.description : description}
        />
        <meta name='apple-mobile-web-app-title' content={title} />
      </Head>
      {advert ? (
        <>
          <Script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'Product',
                name: advert.title,
                description: advert.description,
                image: advert.images,
                offers: {
                  '@type': 'Offer',
                  // @ts-ignore
                  price: advert.priceFloat || 0,
                  // @ts-ignore
                  priceCurrency: advert.currencyCode,
                  priceValidUntil: DateTime.local()
                    .plus({months: 1})
                    .toISODate(),
                  availability: 'https://schema.org/InStock',
                  url: `https://adverto.sale${advert.url}`,
                  sku: owner.hash,
                  description: advert.description,
                  image: advert.images,
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://adverto.sale/all/all?q={search_query}',
                  'query-input': 'required name=search_query',
                },

                ...(brand
                  ? {
                      brand: {
                        '@type': 'Brand',
                        name: brand,
                      },
                    }
                  : {}),
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
  content_name: '${advert.title}',
  content_ids: ['${advert.hash}'],
  content_type: 'product',
  value: ${
    // @ts-ignore
    advert.priceFloat || 0
  },
  currency: '${
    // @ts-ignore
    advert.currencyCode
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
      <Script src='https://www.googletagmanager.com/gtag/js?id=UA-211806856-1' />
      <Script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'UA-211806856-1');`,
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
