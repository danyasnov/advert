import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {SerializedCookiesState} from '../types'
import {useProductsStore} from '../providers/RootStoreProvider'
import {shallowUpdateQuery} from '../helpers'
import SelectWrapper from './SelectWrapper'
import {FilterStyles} from './Selects/styles'

const getSortOptions = (t: TFunction) => [
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
]
const SortSelect: FC<{id?: string; filterStyle?: boolean}> = observer(
  ({id, filterStyle}) => {
    const {t} = useTranslation()
    const {query} = useRouter()
    const mobileStyles = {
      singleValue: 'text-body-12',
      valueContainer: 'py-[10px] h-10',
    }
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
      <SelectWrapper
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
        classNameOpt={filterStyle ? mobileStyles : {}}
      />
    )
  },
)

export default SortSelect
