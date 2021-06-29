import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcSort from 'icons/material/Sort.svg'
import {parseCookies} from 'nookies'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import LinkSelect from './Selects/LinkSelect'
import {SerializedCookiesState} from '../types'

const withIcons = (options) => {
  return options.map((o) => ({
    ...o,
    icon: o.value.includes('desc') ? (
      <IcSort className='fill-current text-black-c' />
    ) : (
      <IcSort className='fill-current text-black-c rotate-180	' />
    ),
  }))
}

const CategoryHeader: FC = observer(() => {
  const {categoryData} = useCategoriesStore()
  const {sortBy, setSortBy, fetchProducts} = useProductsStore()
  const {t} = useTranslation()
  const state: SerializedCookiesState = parseCookies()
  const [options, setOptions] = useState(
    withIcons([
      {
        value: 'date_published-asc',
        label: t('SORT_DIRECTION_MESSAGE_DATE_ASC'),
      },
      {
        value: 'date_published-desc',
        label: t('SORT_DIRECTION_MESSAGE_DATE_DESC'),
      },
      {value: 'price-asc', label: t('SORT_BY_PRICE_LOW_TO_HIGH')},
      {value: 'price-desc', label: t('SORT_BY_PRICE_HIGH_TO_LOW')},
      {value: 'distance-asc', label: t('SORT_DIRECTION_MESSAGE_DISTANCE_ASC')},
      {
        value: 'distance-desc',
        label: t('SORT_DIRECTION_MESSAGE_DISTANCE_DESC'),
      },
    ]),
  )
  useEffect(() => {
    if (state.searchBy !== 'coords') {
      setOptions(
        options.filter(
          (o) => !['distance-asc', 'distance-desc'].includes(o.value),
        ),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!categoryData) return null
  return (
    <div className='flex justify-between border-b border-shadow-b pb-4 mb-6 mt-4'>
      <h1 className='text-h-1 text-black-b '>{categoryData.name}</h1>
      <div className='w-60'>
        <LinkSelect
          id='sort'
          onChange={({value}) => {
            setSortBy(value as string)
            fetchProducts()
          }}
          value={options.find(({value}) => value === sortBy)}
          options={options}
          isSearchable={false}
          placeholder={t('SORTING_ORDER')}
        />
      </div>
    </div>
  )
})

export default CategoryHeader
