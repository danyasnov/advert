import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import Head from 'next/head'
import {useRouter} from 'next/router'
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

const MainLayout: FC = observer(() => {
  const {locationCodes} = useGeneralStore()
  const {
    freeProducts,
    discountedProducts,
    products,
    state,
    count,
    page,
    fetchProducts,
    applyFilter,
  } = useProductsStore()
  const {query} = useRouter()
  const {t} = useTranslation()

  return (
    <HeaderFooterWrapper>
      <Head>
        <title>{t('SITE_MAIN_PAGE_META_TITLE')}</title>
        <meta name='description' content={t('MAIN_PAGE_DESCRIPTION')} />
      </Head>
      <Button className='s:hidden flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap fixed left-1/2 -translate-x-1/2	w-40 z-10 bottom-20'>
        <LinkWrapper href='/new-ad' title={t('NEW_AD')}>
          <span className='capitalize-first text-white'>{t('NEW_AD')}</span>
        </LinkWrapper>
      </Button>
      <div className='bg-black-e py-8 m:flex'>
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
              <ScrollableCardGroup
                products={products}
                count={count}
                page={page}
                state={state}
                fetchProducts={() =>
                  fetchProducts({page: page + 1, isScroll: true, query}).then(
                    () => applyFilter(),
                  )
                }
              />
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
