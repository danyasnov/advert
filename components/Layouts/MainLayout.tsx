import {FC, useEffect, useState, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import Joyride, {Step} from 'react-joyride'
import {isEmpty} from 'lodash'
import CategoriesSlider from '../CategoriesSlider'
import ProductsSlider from '../Cards/ProductsSlider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import LinkWrapper from '../Buttons/LinkWrapper'
import TitleWithSeparator from '../TitleWithSeparator'
import MetaTags from '../MetaTags'
import {SerializedCookiesState} from '../../types'
import {makeRequest} from '../../api'
import OutlineButton from '../Buttons/OutlineButton'
import Banners from '../Banners'
import MainBanner from '../MainBanner'
import useTourVisibility from '../../hooks/useTourVisibility'

const MainLayout: FC = observer(() => {
  // keep showCookiesWarn to force rerender layout
  const {locationCodes} = useGeneralStore()
  const {categoriesById} = useCategoriesStore()
  const {otherProducts, setProducts} = useProductsStore()
  const {t} = useTranslation()
  const [showBanners, setShowBanners] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const cookies: SerializedCookiesState = parseCookies()
  const showTour = useTourVisibility('visitMainPageCount')
  useEffect(() => {
    setShowBanners(true)
  }, [])
  const productsArr = [
    {
      data: {categoryId: null},
      name: 'all',
      slug: 'all',
    },
    {
      data: {categoryId: 20},
      name: categoriesById[20]?.name,
      slug: categoriesById[20]?.slug,
      url: `${locationCodes}/${categoriesById[20]?.slug}`,
    },
    {
      data: {categoryId: 1},
      name: categoriesById[1]?.name,
      slug: categoriesById[1]?.slug,
      url: `${locationCodes}/${categoriesById[1]?.slug}`,
    },
    {
      data: {categoryId: 10068},
      name: categoriesById[10068]?.name,
      slug: categoriesById[10068]?.slug,
      url: `${locationCodes}/${categoriesById[10068]?.slug}`,
    },
  ]
  useEffect(() => {
    const initProducts = async () => {
      const url = '/api/products'

      const promises = productsArr.map((p) =>
        makeRequest({
          url,
          data: {filter: p.data, limit: 20},
          method: 'post',
        }),
      )
      setIsLoading(true)
      Promise.all(promises).then((res) => {
        setIsLoading(false)
        setProducts(res[0].data?.result?.data || [], productsArr[0].slug)
        setProducts(res[1].data?.result?.data || [], productsArr[1].slug)
        setProducts(res[2].data?.result?.data || [], productsArr[2].slug)
        setProducts(res[3].data?.result?.data || [], productsArr[3].slug)
      })
    }
    initProducts()
  }, [
    cookies.countryId,
    cookies.searchLocation,
    cookies.searchRadius,
    cookies.searchBy,
    cookies.cityId,
    cookies.regionId,
  ])

  const steps: Step[] = [
    {
      target: '#header-search',
      content: t('HINT_LOCATION'),
      disableBeacon: true,
      placement: 'bottom-end',
      offset: 5,
    },
  ]

  return (
    <HeaderFooterWrapper>
      <MetaTags
        title={t('SITE_MAIN_PAGE_META_TITLE')}
        description={t('MAIN_PAGE_DESCRIPTION')}
      />
      <div className='py-8 flex flex-col min-h-1/2'>
        {showTour && (
          <Joyride
            steps={steps}
            hideCloseButton
            floaterProps={{hideArrow: true}}
            styles={{
              tooltip: {
                paddingTop: '0',
              },
              buttonNext: {
                backgroundColor: 'transparent',
                padding: '0px 10px 10px 20px',
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
        )}

        {showBanners && <Banners />}
        <div className='m:flex m:justify-center m:w-full'>
          <main className='m:w-944px l:w-[1208px] '>
            <CategoriesSlider />
            <div className='flex mt-15 m:grid m:grid-cols-main-m l:grid-cols-main-l m:gap-x-8 drop-shadow-card'>
              <div className='space-y-15 overflow-hidden m:overflow-visible w-full'>
                {productsArr
                  .filter((p) => p.url)
                  .map((p) => (
                    <ProductsSlider
                      products={otherProducts[p.slug] || []}
                      title={p.name}
                      rightContent={
                        <LinkWrapper
                          title={t('SEE_ALL')}
                          className='text-body-16 text-primary-500 font-bold'
                          href={p.url}>
                          {t('SEE_ALL')}
                        </LinkWrapper>
                      }
                    />
                  ))}
                <div>
                  {!isEmpty(otherProducts.all) && (
                    <TitleWithSeparator
                      title={t('RECOMMENDATIONS_FOR_YOU')}
                      rightContent={
                        <LinkWrapper
                          title={t('SEE_ALL')}
                          className='text-body-16 text-primary-500 font-bold'
                          href={locationCodes}>
                          {t('SEE_ALL')}
                        </LinkWrapper>
                      }
                    />
                  )}
                  <div className='mx-4 s:mx-8 m:mx-0 flex flex-col items-center'>
                    <ScrollableCardGroup
                      className='s:grid-cols-3 m:grid-cols-3 l:grid-cols-4'
                      products={otherProducts.all}
                      state={isLoading ? 'pending' : 'done'}
                      disableScroll
                    />
                    {!isEmpty(otherProducts.all) && (
                      <LinkWrapper
                        title={t('SEE_ALL')}
                        className='text-body-16 text-primary-500 font-bold relative z-10'
                        href={locationCodes}>
                        <OutlineButton>{t('SEE_ALL')}</OutlineButton>
                      </LinkWrapper>
                    )}
                  </div>
                </div>
              </div>
              <MainBanner />
            </div>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default MainLayout
