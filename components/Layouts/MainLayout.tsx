import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import Head from 'next/head'
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

const MainLayout: FC = observer(() => {
  const {locationCodes} = useGeneralStore()
  const {freeProducts, discountedProducts} = useProductsStore()
  const {t} = useTranslation()

  return (
    <HeaderFooterWrapper>
      <Head>
        <title>{t('MAIN_PAGE_TITLE')}</title>
      </Head>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px space-y-12'>
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
              <ScrollableCardGroup />
            </div>
          </main>
          <aside
            className='hidden m:block bg-white'
            style={{width: '288px', height: '700px'}}
          />
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default MainLayout
