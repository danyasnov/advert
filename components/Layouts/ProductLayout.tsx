import {FC, useEffect, useState, useRef} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import Joyride, {Step} from 'react-joyride'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import {SerializedCookiesState} from '../../types'
import {trackSingle, setCookiesObject} from '../../helpers'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import ProductHeader from '../ProductHeader'
import ProductDescription from '../ProductDescription'
import ProductSidebar from '../ProductSidebar'
import ProductPhotos from '../ProductPhotos'
import ProductsSlider from '../Cards/ProductsSlider'
import {useProductsStore} from '../../providers/RootStoreProvider'
import {unixToDate} from '../../utils'
import MetaTags from '../MetaTags'
import useTourVisibility from '../../hooks/useTourVisibility'

const ProductLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {similarProducts, product} = useProductsStore()
  const seoString = `${product.advert.title}, ${
    product.advert.location.city
  } - ${t('SITE_PAGE_DESCRIPTION_PART')}, ${t('PRICE')} ${
    product.advert.price
  }, ${t('HOSTED')}: ${unixToDate(product.advert.dateUpdated)}`
  useEffect(() => {
    trackSingle('ViewContent')
  }, [])

  const showTour = useTourVisibility('visitProductTourCount')

  const steps: Step[] = [
    {
      target: '#owner',
      content: t('HINT_SUBSCRIBE'),
      disableBeacon: true,
      isFixed: true,
      placement: 'bottom',
      offset: 5,
    },
  ]

  return (
    <HeaderFooterWrapper>
      <MetaTags title={seoString} product={product} />
      <div className='py-8 m:flex min-h-1/2'>
        <div className='m:flex m:mx-12 m:justify-center m:w-full'>
          <div className='m:w-944px l:w-[1208px] mx-4 s:mx-8 m:mx-0'>
            <div className='s:flex s:space-x-4 m:space-x-8'>
              <main className='s:w-[464px] m:w-[614px] l:w-896px'>
                <ProductHeader />
                <ProductPhotos />
                <ProductDescription />
                <div className='-mx-4 s:hidden drop-shadow-card'>
                  <ProductsSlider
                    products={similarProducts}
                    title={t('SIMILAR_ADS_TAB')}
                  />
                </div>
              </main>
              <aside className='hidden s:block s:w-[224px] m:w-[280px]'>
                <ProductSidebar />
              </aside>
            </div>
            <div className='-mx-8 m:-mx-0 hidden s:block drop-shadow-card'>
              <ProductsSlider
                products={similarProducts}
                title={t('SIMILAR_ADS_TAB')}
              />
            </div>
          </div>
        </div>
        {/* {showTour && (
          <Joyride
            steps={steps}
            hideCloseButton
            floaterProps={{hideArrow: true, disableFlip: true}}
            styles={{
              tooltip: {
                paddingTop: '0',
              },
              buttonNext: {
                backgroundColor: 'transparent',
                padding: '0px 20px 10px 20px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'white',
                border: 'none',
                borderRadius: '0',
                outline: 'none',
              },
              tooltipContainer: {
                textAlign: 'left',
              },
            }}
            locale={{close: t('HINT_OK')}}
          />
        )} */}
      </div>
    </HeaderFooterWrapper>
  )
})

export default ProductLayout
