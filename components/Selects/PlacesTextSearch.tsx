/* eslint-disable react/jsx-props-no-spreading */
import {FC, useCallback, useEffect, useState} from 'react'
import {useCombobox} from 'downshift'
import {debounce} from 'lodash'
import {useTranslation} from 'next-i18next'
import {Send} from 'react-iconly'
import {TypeOfDegradation} from 'front-api/src/models'
import {makeRequest} from '../../api'
import InlineMapRadiusSelector from '../InlineMapRadiusSelector'

interface Props {
  handleSelectLocation: (item: {
    label: string
    geometry: {location: {lat: number; lng: number}}
  }) => void
  label: string
  radius: number
  setRadius: (radius: number, key: TypeOfDegradation) => void
}

const PlacesTextSearch: FC<Props> = ({
  handleSelectLocation,
  label,
  radius,
  setRadius,
}) => {
  const {t} = useTranslation()
  const [focused, setFocused] = useState(false)
  const [item, setItem] = useState({label: ''})
  const [inputItems, setInputItems] = useState([])
  useEffect(() => {
    setItem({label})
  }, [label])
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
      <div
        className='flex items-center relative bg-white rounded-3xl overflow-hidden px-2'
        {...getComboboxProps()}>
        <div
          className={`absolute ml-2 ${
            focused ? 'text-primary-500' : 'text-greyscale-500'
          }`}>
          <Send size={20} filled />
        </div>
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
          className='manual-outline pr-4 py-3 pl-10 text-greyscale-900 text-body-16 w-full h-full outline-none'
          data-test-id='location-search'
          id='search-autocomplete'
        />
        <div className='hidden m:block'>
          <InlineMapRadiusSelector radius={radius} setRadius={setRadius} />
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className='z-10 w-full bg-white shadow-xl absolute top-14 rounded-lg overflow-hidden w-96'>
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
              className={`flex flex-col h-14 px-4 py-3 justify-center cursor-pointer  ${
                highlightedIndex === index ? 'bg-greyscale-100' : ''
              }`}
              key={newItem.value}>
              <span className='text-body-14 text-greyscale-900 truncate'>
                {newItem.label}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default PlacesTextSearch
