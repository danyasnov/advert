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

  // let yandexMetrikaId
  // switch (language) {
  //   case 'ru':
  //     yandexMetrikaId = 'db8a14e599462c4c'
  //     break
  //   case 'el':
  //     yandexMetrikaId = '631377a5229beaf4'
  //     break
  //   case 'uk':
  //     yandexMetrikaId = '2c9bed981a52783d'
  //     break
  //   default:
  //     yandexMetrikaId = 'ce08de680afab7c9'
  // }
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
        {/* <meta name='yandex-verification' content={yandexMetrikaId} /> */}
        <meta
          property='og:url'
          content={
            advert ? `https://vooxee.com${advert.url}` : 'https://vooxee.com'
          }
        />
        <meta
          property='og:image'
          content={imageUrl || 'https://vooxee.com/img/logo_playmarket.jpg'}
        />
        <meta
          property='og:image:secure_url'
          content={imageUrl || 'https://vooxee.com/img/logo_playmarket.jpg'}
        />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='512' />
        <meta property='og:image:height' content='512' />
        <meta
          property='og:description'
          content={advert ? advert.description : description}
        />
        <meta name='apple-mobile-web-app-title' content={title} />
        {/* <meta */}
        {/*  name='facebook-domain-verification' */}
        {/*  content='pnu04x7hblq42v4wo1993abj3wkon6' */}
        {/* /> */}
      </Head>
      {advert ? (
        <>
          <Script
            id='schema'
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
                  url: `https://vooxee.com${advert.url}`,
                  sku: owner.hash,
                  description: advert.description,
                  image: advert.images,
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://vooxee.com/all/all?q={search_query}',
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
          {/*          <Script */}
          {/*            id='fb' */}
          {/*            type='application/ld+json' */}
          {/*            dangerouslySetInnerHTML={{ */}
          {/*              __html: `!function(f,b,e,v,n,t,s) */}
          {/*  {if(f.fbq)return;n=f.fbq=function(){n.callMethod? */}
          {/*    n.callMethod.apply(n,arguments):n.queue.push(arguments)}; */}
          {/*    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; */}
          {/*    n.queue=[];t=b.createElement(e);t.async=!0; */}
          {/*    t.src=v;s=b.getElementsByTagName(e)[0]; */}
          {/*    s.parentNode.insertBefore(t,s)}(window, document,'script', */}
          {/*  'https://connect.facebook.net/en_US/fbevents.js'); */}
          {/*  fbq('init', '501894937955088'); */}
          {/*  fbq('track', 'PageView'); */}
          {/*  fbq('track', 'ViewContent', { */}
          {/*  content_name: '${advert.title}', */}
          {/*  content_ids: ['${advert.hash}'], */}
          {/*  content_type: 'product', */}
          {/*  value: ${ */}
          {/*    // @ts-ignore */}
          {/*    advert.priceFloat || 0 */}
          {/*  }, */}
          {/*  currency: '${ */}
          {/*    // @ts-ignore */}
          {/*    advert.currencyCode */}
          {/*  }' */}
          {/* });`, */}
          {/*            }} */}
          {/*          /> */}
        </>
      ) : (
        <>
          {/* <Script */}
          {/*  id='fbevents' */}
          {/*  dangerouslySetInnerHTML={{ */}
          {/*    __html: `!function(f,b,e,v,n,t,s) */}
          {/*    {if(f.fbq)return;n=f.fbq=function(){n.callMethod? */}
          {/*    n.callMethod.apply(n,arguments):n.queue.push(arguments)}; */}
          {/*    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; */}
          {/*    n.queue=[];t=b.createElement(e);t.async=!0; */}
          {/*    t.src=v;s=b.getElementsByTagName(e)[0]; */}
          {/*    s.parentNode.insertBefore(t,s)}(window, document,'script', */}
          {/*    'https://connect.facebook.net/en_US/fbevents.js'); */}
          {/*    fbq('init', '501894937955088'); */}
          {/*    fbq('track', 'PageView');`, */}
          {/*  }} */}
          {/* /> */}
          <Script
            id='schema-site'
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'WebSite',
                url: 'https://vooxee.com',
                name: title,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://vooxee.com/all/all?q={search_query}',
                  'query-input': 'required name=search_query',
                },
              }),
            }}
          />
        </>
      )}
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NNJ32XM');
        `}
      </Script>
    </>
  )
}
export default MetaTags
