import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import Select from './Selects/Select'

const CategoryHeader: FC = observer(() => {
  const {categoryData} = useCategoriesStore()
  const {sortBy, setSortBy, fetchProducts} = useProductsStore()
  const {t} = useTranslation()
  const options = [
    {value: 'date_published-asc', label: t('SORT_DIRECTION_MESSAGE_DATE_ASC')},
    {
      value: 'date_published-desc',
      label: t('SORT_DIRECTION_MESSAGE_DATE_DESC'),
    },
    {value: 'price-asc', label: t('SORT_BY_PRICE_LOW_TO_HIGH')},
    {value: 'price-desc', label: t('SORT_BY_PRICE_HIGH_TO_LOW')},
    {value: 'distance-asc', label: t('SORT_DIRECTION_MESSAGE_DISTANCE_ASC')},
    {value: 'distance-desc', label: t('SORT_DIRECTION_MESSAGE_DISTANCE_DESC')},
  ]
  if (!categoryData) return null
  return (
    <div className='flex justify-between border-b border-shadow-b pb-4 mb-6 mt-4'>
      <h1 className='text-h-1 text-black-b '>{categoryData.name}</h1>
      <div className='w-60'>
        <Select
          id='sort'
          onChange={({value}) => {
            setSortBy(value as string)
            fetchProducts()
          }}
          value={options.find(({value}) => value === sortBy)}
          options={options}
          placeholder={t('SORTING_ORDER')}
        />
      </div>
    </div>
  )
})

export default CategoryHeader
