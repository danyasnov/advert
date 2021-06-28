import {FC} from 'react'
import CategoryFilter from '../CategoryFilter'
import Breadcrumbs from '../Breadcrumbs'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'

const CategoriesLayout: FC = () => {
  return (
    <HeaderFooterWrapper>
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px'>
            <Breadcrumbs />
            <CategoryHeader />
            <ScrollableCardGroup />
          </main>
          <aside className='hidden m:block'>
            <CategoryFilter />
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default CategoriesLayout
