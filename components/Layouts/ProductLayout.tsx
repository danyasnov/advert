import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import ProductHeader from '../ProductHeader'
import ProductDescription from '../ProductDescription'
import ProductSidebar from '../ProductSidebar'
import ProductPhotos from '../ProductPhotos'
import ProductsSlider from '../Cards/ProductsSlider'
import {useProductsStore} from '../../providers/RootStoreProvider'

const ProductLayout: FC = () => {
  const {t} = useTranslation()
  const {similarProducts} = useProductsStore()
  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-4 m:flex px-4 s:px-8'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px'>
            <ProductHeader />
            <ProductPhotos />
            <ProductDescription />
            <div className='-mx-4'>
              <ProductsSlider
                products={similarProducts}
                title={t('SIMILAR_ADS_TAB')}
              />
            </div>
          </main>
          <aside className='hidden m:block w-288px'>
            <ProductSidebar />
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default ProductLayout
