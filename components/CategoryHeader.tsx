import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import IcFilter from 'icons/material/Filter.svg'
import IcClear from 'icons/material/Clear.svg'
import {useRouter} from 'next/router'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import SortSelect from './SortSelect'
import Breadcrumbs from './Breadcrumbs'
import Button from './Buttons/Button'
import {getQueryValue} from '../helpers'

interface Props {
  setShowFilter: (show: boolean) => void
  showFilter: boolean
}
const CategoryHeader: FC<Props> = observer(({setShowFilter, showFilter}) => {
  const {categoryData} = useCategoriesStore()
  const {query} = useRouter()
  const search = getQueryValue(query, 'q')
  const header =
    categoryData?.name || `!!результаты поиска по запросу ${search}`

  if (!header) return null
  return (
    <div className='flex justify-between pb-4 mt-4 items-center'>
      <div>
        <Breadcrumbs />
        <h1 className='text-h-2 font-bold text-black-b pt-2'>{header}</h1>
      </div>

      {!showFilter && (
        <div className='hidden s:block min-w-52 self-end mb-1'>
          <SortSelect id='desktop-sort' />
        </div>
      )}
      <Button
        className='m:hidden shadow-xl rounded-full min-w-10 w-10 h-10 bg-white flex justify-center items-center '
        onClick={() => setShowFilter(!showFilter)}>
        {showFilter ? (
          <IcClear className='fill-current text-black-c h-6 w-6' />
        ) : (
          <IcFilter className='fill-current text-black-c w-6 h-6' />
        )}
      </Button>
    </div>
  )
})

export default CategoryHeader
