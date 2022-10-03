import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import IcFilter from 'icons/material/Filter.svg'
import IcClear from 'icons/material/Clear.svg'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import SortSelect from './SortSelect'
import Breadcrumbs from './Breadcrumbs'
import Button from './Buttons/Button'
import {getQueryValue, shallowUpdateQuery} from '../helpers'

const CategoryHeader: FC = observer(() => {
  const {categoryData} = useCategoriesStore()
  const {query} = useRouter()
  const search = getQueryValue(query, 'q')
  const {t} = useTranslation()
  let header = ''
  if (categoryData?.name) {
    header = categoryData?.name
  } else if (search) {
    header = t('SEARCH_RESULTS_BY_QUERY', {query: search})
  }
  return (
    <div className='flex flex-col my-8'>
      <Breadcrumbs />
      <h1 className='text-h-4 font-bold text-greyscale-900 pt-8'>{header}</h1>
    </div>
  )
})

export default CategoryHeader
