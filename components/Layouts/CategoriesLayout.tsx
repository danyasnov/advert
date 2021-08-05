import {FC, useState} from 'react'
import CategoryFilter from '../CategoryFilter'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'
import FilterForm from '../CategoryFilter/FilterForm'
import SortSelect from '../SortSelect'
import QuickCategories from '../QuickCategories'

const CategoriesLayout: FC = () => {
  const [showFilter, setShowFilter] = useState(false)

  return (
    <HeaderFooterWrapper>
      <div className='bg-white px-4 s:px-8 flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='m:w-608px l:w-896px relative'>
            <div className='flex s:hidden'>
              <QuickCategories />
            </div>
            <CategoryHeader
              setShowFilter={setShowFilter}
              showFilter={showFilter}
            />
            {!showFilter && (
              <div className='border-t border-shadow-b'>
                <div className='s:hidden w-48 my-6'>
                  <SortSelect id='mobile-sort' />
                </div>
                <ScrollableCardGroup />
              </div>
            )}
            {showFilter && (
              <div className='s:px-0 s:-mx-0 border-t pb-4 border-shadow-b pt-6 w-full'>
                <FilterForm setShowFilter={setShowFilter} />
              </div>
            )}
          </main>
          <aside className='hidden m:block w-72 mt-8'>
            <CategoryFilter />
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default CategoriesLayout
