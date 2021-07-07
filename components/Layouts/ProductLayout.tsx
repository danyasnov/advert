import {FC} from 'react'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import ProductHeader from '../ProductHeader'
import ProductDescription from '../ProductDescription'
import ProductSidebar from '../ProductSidebar'
import ProductPhotos from '../ProductPhotos'

const ProductLayout: FC = () => {
  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px'>
            <ProductHeader />
            <ProductPhotos />
            <ProductDescription />
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
