import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import CategoriesSlider from '../CategoriesSlider'
import ProductsSlider from '../Cards/ProductsSlider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import RecommendedProducts from '../Cards/RecommendedProducts'
import {useProductsStore} from '../../providers/RootStoreProvider'

const MainLayout: FC = observer(() => {
  const {freeProducts, discountedProducts} = useProductsStore()
  const {t} = useTranslation()

  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px space-y-12'>
            <CategoriesSlider />
            <ProductsSlider
              products={discountedProducts}
              title={t('DISCOUNTED_GOODS')}
            />
            <ProductsSlider products={freeProducts} title={t('FREE')} />
            <RecommendedProducts />
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
