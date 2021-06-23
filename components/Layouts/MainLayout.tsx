import {FC} from 'react'
import CategoriesSlider from '../CategoriesSlider'
import ProductsSlider from '../Cards/ProductsSlider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import RecommendedProducts from '../Cards/RecommendedProducts'

const MainLayout: FC = () => {
  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px space-y-12'>
            <CategoriesSlider />
            <ProductsSlider />
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
}

export default MainLayout
