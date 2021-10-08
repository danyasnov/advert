import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import CategoriesSlider from '../CategoriesSlider'
import ProductsSlider from '../Cards/ProductsSlider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {
  useGeneralStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import LinkWrapper from '../Buttons/LinkWrapper'
import TitleWithSeparator from '../TitleWithSeparator'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'
import {SerializedCookiesState} from '../../types'
import useScrollDirection from '../../hooks/useScrollDirection'
import {makeRequest} from '../../api'

const MainLayout: FC = observer(() => {
  // keep showCookiesWarn to force rerender layout
  const {locationCodes, showCookiesWarn} = useGeneralStore()
  const cookies: SerializedCookiesState = parseCookies()
  const {
    freeProducts,
    discountedProducts,
    products,
    state,
    count,
    page,
    fetchProducts,
    applyFilter,
    setProducts,
  } = useProductsStore()
  const {query} = useRouter()
  const {t} = useTranslation()

  useEffect(() => {
    const initProducts = async () => {
      fetchProducts().then(applyFilter)
      const url = '/api/products'
      const freeProductsPromise = makeRequest({
        url,
        data: {filter: {priceMax: 0}, limit: 10},
        method: 'post',
      })
      const discountedProductsPromise = makeRequest({
        url,
        data: {filter: {onlyDiscounted: true}, limit: 10},
        method: 'post',
      })
      Promise.all([freeProductsPromise, discountedProductsPromise]).then(
        (res) => {
          setProducts(res[0].data.result.data, 'freeProducts')
          setProducts(res[1].data.result.data, 'discountedProducts')
        },
      )
    }
    initProducts()
  }, [])

  const scrollDir = useScrollDirection()
  return (
    <HeaderFooterWrapper>
      <MetaTags
        title={t('SITE_MAIN_PAGE_META_TITLE')}
        description={t('MAIN_PAGE_DESCRIPTION')}
      />
      {cookies.cookieAccepted && (
        <Button
          className={`${
            scrollDir === 'up' ? '' : 'translate-y-full'
          } transform ease-in-out duration-200 s:hidden fixed left-1/2 -translate-x-1/2 w-40 z-10 bottom-0 `}>
          <div className='mb-2'>
            <LinkWrapper
              href='/new-ad'
              title={t('NEW_AD')}
              className='flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap'>
              <span className='capitalize-first text-white'>{t('NEW_AD')}</span>
            </LinkWrapper>
          </div>
        </Button>
      )}
      <div className='bg-black-e py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12'>
            <CategoriesSlider />
            <ProductsSlider
              products={discountedProducts}
              title={t('DISCOUNTED_GOODS')}
            />
            <ProductsSlider products={freeProducts} title={t('FREE')} />
            <div>
              <TitleWithSeparator
                title={t('RECOMMENDATIONS_FOR_YOU')}
                rightContent={
                  <LinkWrapper
                    title={t('SEE_ALL')}
                    className='text-body-3 text-brand-b1'
                    href={locationCodes}>
                    {t('SEE_ALL')}
                  </LinkWrapper>
                }
              />
              <div className='mx-4 s:mx-8 m:mx-0'>
                <ScrollableCardGroup
                  products={products}
                  count={count}
                  enableFourthColumnForM
                  page={page}
                  state={state}
                  hideNotFoundDescription
                  fetchProducts={() =>
                    fetchProducts({page: page + 1, isScroll: true, query}).then(
                      () => applyFilter(),
                    )
                  }
                />
              </div>
            </div>
          </main>
          {/* <aside */}
          {/*  className='hidden m:block bg-white' */}
          {/*  style={{width: '288px', height: '700px'}} */}
          {/* /> */}
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default MainLayout
