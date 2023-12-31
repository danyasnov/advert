/* eslint-disable react/jsx-props-no-spreading */
import {FC, useCallback, useState} from 'react'
import {useCombobox} from 'downshift'
import {debounce, isEmpty, isObject, last} from 'lodash'
import {useTranslation} from 'next-i18next'
import {Search} from 'react-iconly'
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
        <div className='absolute inset-y-0 left-3 text-greyscale-500 flex items-center'>
          <Search size={20} />
        </div>
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
          className='pl-12 px-3.5 py-3 text-greyscale-900 text-body-16 rounded-xl w-full h-10 bg-greyscale-100 outline-none focus:bg-purple/10 focus:border-primary-500 border border-transparent'
          id='search-autocomplete'
        />
      </div>
      <ul
        {...getMenuProps()}
        className='z-10 bg-white shadow-xl absolute top-12 rounded-2xl divide-y divide-greyscale-200 '>
        {isOpen &&
          inputItems.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
            <li
              {...getItemProps({item, index})}
              onClick={() => {
                closeMenu()
                handleSelectedItemChange(item)
              }}
              className={`flex flex-col mx-5 py-4 justify-center cursor-pointer  ${
                highlightedIndex === index ? '' : ''
              }`}
              key={item.id}>
              <span className='text-body-16 font-medium text-greyscale-900 truncate mb-1'>
                {item.title}
              </span>
              <span className='text-body-14 text-black-c truncate'>
                {item.secondary}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default SearchCategories
