import {FC, useState} from 'react'
import CategoryFilter from '../CategoryFilter'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'
import FilterForm from '../CategoryFilter/FilterForm'

const CategoriesLayout: FC = () => {
  const [showFilter, setShowFilter] = useState(false)

  return (
    <HeaderFooterWrapper>
      <div className='bg-white px-4 s:px-8 flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='m:w-608px l:w-896px relative'>
            <CategoryHeader
              setShowFilter={setShowFilter}
              showFilter={showFilter}
            />
            {!showFilter && <ScrollableCardGroup />}
            <div
              className={`${
                showFilter ? 'flex' : 'hidden'
              } px-4  s:px-0 s:-mx-0 border-t border-b pb-8 mb-6 border-shadow-b pt-6 w-full`}>
              <FilterForm />
            </div>
          </main>
          <aside className='hidden m:block w-72 mt-4'>
            <CategoryFilter />
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default CategoriesLayout
