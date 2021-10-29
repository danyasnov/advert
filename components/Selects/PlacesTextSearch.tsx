/* eslint-disable react/jsx-props-no-spreading */
import {FC, useCallback, useState} from 'react'
import {useCombobox} from 'downshift'
import {debounce} from 'lodash'
import {useTranslation} from 'next-i18next'
import IcMyLocation from 'icons/material/MyLocation.svg'
import {makeRequest} from '../../api'

interface Props {
  handleSelectLocation: (item: {
    label: string
    geometry: {location: {lat: number; lng: number}}
  }) => void
}

const PlacesTextSearch: FC<Props> = ({handleSelectLocation}) => {
  const {t} = useTranslation()
  const [focused, setFocused] = useState(false)
  const [item, setItem] = useState({label: ''})
  const [inputItems, setInputItems] = useState([])
  const onInputValueChange = useCallback(
    debounce(({inputValue}) => {
      if (!inputValue) {
        setInputItems([])
      } else {
        makeRequest({
          method: 'get',
          url: '/api/location-text-search',
          params: {query: inputValue},
        }).then((res) => {
          setInputItems(
            res.data.results
              .map((l) => ({
                label: l.formatted_address,
                value: l.place_id,
                geometry: l.geometry,
              }))
              .slice(0, 10),
          )
        })
      }
    }, 2000),
    [],
  )
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    closeMenu,
  } = useCombobox({
    id: 'search-autocomplete',
    items: inputItems,
    selectedItem: item?.label ?? '',
    onInputValueChange,
  })

  return (
    <div className='flex flex-col w-full'>
      <div className='flex items-center relative' {...getComboboxProps()}>
        <IcMyLocation
          className={`absolute w-6 h-6 fill-current ml-3 ${
            focused ? 'text-nc-primary' : 'text-nc-icon'
          }`}
        />
        <input
          {...getInputProps({
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                // @ts-ignore
                e.nativeEvent.preventDownshiftDefault = true
                const newItem = inputItems[highlightedIndex] || item
                handleSelectLocation(newItem)
                setItem(newItem)
              }
            },
          })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={t('SEARCH')}
          className='pr-4.5 py-3.5 pl-11 text-black-b text-body-1 rounded-2 w-full h-full -my-1px'
          id='search-autocomplete'
        />
      </div>
      <ul
        {...getMenuProps()}
        className='z-10 w-full bg-white shadow-xl absolute top-14 rounded-lg overflow-hidden'>
        {isOpen &&
          inputItems.map((newItem, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
            <li
              {...getItemProps({item: newItem, index})}
              onClick={() => {
                closeMenu()
                handleSelectLocation(newItem)
                setItem(newItem)
              }}
              className={`flex flex-col h-14 px-4 py-3 justify-center  ${
                highlightedIndex === index ? 'bg-nc-accent' : ''
              }`}
              key={newItem.value}>
              <span className='text-body-2 text-black-b truncate'>
                {newItem.label}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default PlacesTextSearch
