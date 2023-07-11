import {FC, useEffect, useState} from 'react'
import {components} from 'react-select'
import {TFunction, useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import IcCaretDown from 'icons/material/CarretDown.svg'
import {SerializedCookiesState} from '../../types'
import {useProductsStore} from '../../providers/RootStoreProvider'
import {shallowUpdateQuery} from '../../helpers'
import Select from './Select'
import {AutoSortStyles} from './styles'

const {SingleValue} = components
const getSortOptions = (t: TFunction) => [
  {
    value: 'date_updated-asc',
    label: t('NEWEST_FIRST'),
  },
  {
    value: 'date_updated-desc',
    label: t('OLDEST_FIRST'),
  },
  {value: 'price-asc', label: t('LOWEST_PRICE')},
  {value: 'price-desc', label: t('HIGHER_PRICE')},
]
const CustomSingleValue = (props) => {
  const {data} = props
  const {label} = data
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SingleValue {...props} className='flex items-center space-x-2 p-0'>
      <span className='text-body-16 text-primary-500 font-medium'>{label}</span>
      <IcCaretDown
        className={`${
          props.selectProps.menuIsOpen ? 'rotate-180' : ''
        } w-5 h-5 shrink-0`}
      />
    </SingleValue>
  )
}
const AutoSortSelect: FC = () => {
  const {t} = useTranslation()
  const {query} = useRouter()

  const state: SerializedCookiesState = parseCookies()
  const {sortBy, setSortBy, fetchProducts, hideDistanceSort, applyFilter} =
    useProductsStore()

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
      id='sort-select'
      value={options.find(({value}) => value === sortBy)}
      options={options}
      placeholder={t('SORTING_ORDER')}
      isSearchable={false}
      onChange={({value}) => {
        const params = new URLSearchParams(window.location.search)
        params.set('sortBy', value as string)
        setSortBy(value as string)
        shallowUpdateQuery(params.toString())
        fetchProducts({query}).then(() => applyFilter())
      }}
      styles={AutoSortStyles}
      components={{SingleValue: CustomSingleValue}}
      filterStyle
    />
  )
}

export default AutoSortSelect
