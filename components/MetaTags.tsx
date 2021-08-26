import {FC} from 'react'
import Head from 'next/head'
import {AdvertiseFullModel} from 'front-api/src/models/index'

interface Props {
  title: string
  description?: string
  product?: AdvertiseFullModel
}
const MetaTags: FC<Props> = ({title, description, product}) => {
  return (
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
      {product ? (
        <>
          <script
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
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(`!function(f,b,e,v,n,t,s)
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
});`),
            }}
          />
        </>
      ) : (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1735830353144099');
            fbq('track', 'PageView');`),
            }}
          />
          <script
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
    </Head>
  )
}
export default MetaTags
