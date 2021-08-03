import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcSort from 'icons/material/Sort.svg'
import {useRouter} from 'next/router'
import {SerializedCookiesState} from '../types'
import LinkSelect from './Selects/LinkSelect'
import {useProductsStore} from '../providers/RootStoreProvider'
import {setSortToUrl} from '../utils'

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
const SortSelect: FC<{id?: string}> = observer(({id}) => {
  const {t} = useTranslation()
  const {query, push, asPath} = useRouter()
  const state: SerializedCookiesState = parseCookies()
  const {sortBy, setSortBy, fetchProducts, hideDistanceSort} =
    useProductsStore()
  const [options, setOptions] = useState(
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
    ]),
  )
  useEffect(() => {
    if (state.searchBy !== 'coords' || hideDistanceSort) {
      setOptions(
        options.filter(
          (o) => !['distance-asc', 'distance-desc'].includes(o.value),
        ),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <LinkSelect
      id={id}
      onChange={({value}) => {
        setSortBy(value as string)
        push(setSortToUrl(asPath, value as string), null, {
          shallow: true,
        })
        fetchProducts({query})
      }}
      value={options.find(({value}) => value === sortBy)}
      options={options}
      isSearchable={false}
      placeholder={t('SORTING_ORDER')}
    />
  )
})

export default SortSelect
