import {FC} from 'react'
import {toJS} from 'mobx'
import CategoryFilter from '../CategoryFilter'
import Breadcrumbs from '../Breadcrumbs'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'
import {useProductsStore} from '../../providers/RootStoreProvider'
import ProductHeader from '../ProductHeader'
import ProductDescription from '../ProductDescription'

const ProductLayout: FC = () => {
  // const {product} = useProductsStore()
  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px'>
            <ProductHeader />
            <ProductDescription />
            {/* <Breadcrumbs /> */}
            {/* <ScrollableCardGroup /> */}
          </main>
          <aside className='hidden m:block w-288px'>
            {/* <CategoryFilter /> */}
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default ProductLayout
