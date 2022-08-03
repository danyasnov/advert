/* eslint-disable react/jsx-props-no-spreading */
import {FC, useCallback, useState} from 'react'
import {useCombobox} from 'downshift'
import {debounce, isEmpty, isObject, last} from 'lodash'
import {useTranslation} from 'next-i18next'
import IcSearch from 'icons/material/Search.svg'
import {makeRequest} from '../../api'

interface Props {
  handleSelectedItemChange: (item: {title: string; id: string}) => void
}

const SearchCategories: FC<Props> = ({handleSelectedItemChange}) => {
  const {t} = useTranslation()
  const [inputItems, setInputItems] = useState([])
  const onInputValueChange = useCallback(
    debounce(({inputValue}) => {
      const trimmed = inputValue.trim()

      if (!inputValue) return setInputItems([])
      return makeRequest({
        method: 'get',
        url: '/api/search-suggestions',
        params: {search: trimmed},
      }).then((res) => {
        console.log(res.data)
        const items = res.data
          // eslint-disable-next-line camelcase
          .map((i: {cat_id: string; path_word: string[]}) => {
            if (isObject(i)) {
              return {
                title: last(i.path_word),
                id: i.cat_id,
                secondary: i.path_word.slice(0, -1).join(' / '),
              }
            }
            return null
          })
          .filter((i) => !!i)
        if (isEmpty(items)) {
          items.push({
            title: t('CATEGORIES_NOT_FOUND', {title: trimmed}),
            id: 0,
          })
        }
        setInputItems(items)
      })
    }, 1000),
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
    // @ts-ignore
    onSelectedItemChange: handleSelectedItemChange,
    onInputValueChange,
  })

  return (
    <div className='flex flex-col w-full relative'>
      <div className='flex relative' {...getComboboxProps()}>
        <IcSearch className='w-7 h-7 absolute top-1.5 left-3' />
        <input
          {...getInputProps({
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                // @ts-ignore
                e.nativeEvent.preventDownshiftDefault = true
                handleSelectedItemChange(inputItems[highlightedIndex])
              }
            },
          })}
          data-test-id='category-search'
          placeholder={t('SEARCH_BY_CATEGORIES')}
          className='pl-12 px-3.5 py-3 text-black-b text-body-14 rounded-2 w-full h-10 border border-nc-border'
          id='search-autocomplete'
        />
      </div>
      <ul
        {...getMenuProps()}
        className='z-10 bg-white shadow-xl absolute top-12 '>
        {isOpen &&
          inputItems.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
            <li
              {...getItemProps({item, index})}
              onClick={() => {
                closeMenu()
                handleSelectedItemChange(item)
              }}
              className={`flex flex-col h-14 px-4 py-3 justify-center  ${
                highlightedIndex === index ? 'bg-brand-a2' : ''
              }`}
              key={item.id}>
              <span className='text-body-14 text-black-b truncate'>
                {item.title}
              </span>
              <span className='text-body-12 text-black-c truncate'>
                {item.secondary}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default SearchCategories
