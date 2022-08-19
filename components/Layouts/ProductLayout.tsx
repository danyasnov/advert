import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import ProductHeader from '../ProductHeader'
import ProductDescription from '../ProductDescription'
import ProductSidebar from '../ProductSidebar'
import ProductPhotos from '../ProductPhotos'
import ProductsSlider from '../Cards/ProductsSlider'
import {useProductsStore} from '../../providers/RootStoreProvider'
import {unixToDate} from '../../utils'
import MetaTags from '../MetaTags'

const ProductLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {similarProducts, product} = useProductsStore()
  const seoString = `${product.advert.title}, ${
    product.advert.location.city
  } - ${t('SITE_PAGE_DESCRIPTION_PART')}, ${t('PRICE')} ${
    product.advert.price
  }, ${t('HOSTED')}: ${unixToDate(product.advert.dateUpdated)}`
  return (
    <HeaderFooterWrapper>
      <MetaTags title={seoString} product={product} />
      <div className='py-4 m:flex px-4 s:px-8 m:py-8 min-h-1/2'>
        <div className='s:flex s:space-x-4 m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='s:w-[464px] m:w-608px l:w-896px drop-shadow-card'>
            {/* <ProductHeader /> */}
            <ProductPhotos />
            <ProductDescription />
          </main>
          <aside className='hidden s:block s:w-[224px] drop-shadow-card'>
            <ProductSidebar />
          </aside>
        </div>
      </div>
      <ProductsSlider products={similarProducts} title={t('SIMILAR_ADS_TAB')} />
    </HeaderFooterWrapper>
  )
})

export default ProductLayout
