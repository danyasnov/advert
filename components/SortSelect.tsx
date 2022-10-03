import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcSort from 'icons/material/Sort.svg'
import {useRouter} from 'next/router'
import {isEmpty} from 'lodash'
import {SerializedCookiesState} from '../types'
import LinkSelect from './Selects/LinkSelect'
import {useProductsStore} from '../providers/RootStoreProvider'
import {shallowUpdateQuery} from '../helpers'
import Select from './Selects/Select'
import {FilterStyles} from './Selects/styles'

const withIcons = (options) => {
  return options.map((o) => ({
    ...o,
    icon: o.value.includes('desc') ? (
      <IcSort className='fill-current text-black-c w-4 h-4' />
    ) : (
      <IcSort className='fill-current text-black-c w-4 h-4 rotate-180	' />
    ),
  }))
}

const getSortOptions = (t: TFunction) =>
  withIcons([
    {
      value: 'date_updated-asc',
      label: t('SORT_DIRECTION_MESSAGE_DATE_ASC'),
    },
    {
      value: 'date_updated-desc',
      label: t('SORT_DIRECTION_MESSAGE_DATE_DESC'),
    },
    {value: 'price-asc', label: t('SORT_BY_PRICE_LOW_TO_HIGH')},
    {value: 'price-desc', label: t('SORT_BY_PRICE_HIGH_TO_LOW')},
    {value: 'distance-asc', label: t('SORT_DIRECTION_MESSAGE_DISTANCE_ASC')},
    {
      value: 'distance-desc',
      label: t('SORT_DIRECTION_MESSAGE_DISTANCE_DESC'),
    },
  ])
const SortSelect: FC<{id?: string}> = observer(({id}) => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const state: SerializedCookiesState = parseCookies()
  const {
    sortBy,
    setSortBy,
    fetchProducts,
    hideDistanceSort,
    applyFilter,
    products,
  } = useProductsStore()

  const [options, setOptions] = useState(getSortOptions(t))
  useEffect(() => {
    setOptions(
      state.searchBy !== 'coords' || hideDistanceSort
        ? getSortOptions(t).filter(
            (o) => !['distance-asc', 'distance-desc'].includes(o.value),
          )
        : getSortOptions(t),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchBy])
  return (
    <Select
      styles={FilterStyles}
      id={id}
      onChange={({value}) => {
        const params = new URLSearchParams(window.location.search)
        params.set('sortBy', value as string)
        setSortBy(value as string)

        shallowUpdateQuery(params.toString())
        fetchProducts({query}).then(() => applyFilter())
      }}
      value={options.find(({value}) => value === sortBy)}
      options={options}
      isSearchable={false}
      placeholder={t('SORTING_ORDER')}
    />
  )
})

export default SortSelect
