/* eslint-disable react/jsx-props-no-spreading */
import {FC, useCallback, useState} from 'react'
import {useCombobox} from 'downshift'
import {debounce, isObject, isString, last} from 'lodash'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {makeRequest} from '../../api'
import {getCategoriesSlugsPathFromIds, getLocationCodes} from '../../helpers'
import {useCategoriesStore} from '../../providers/RootStoreProvider'

interface Props {
  selectedItem: string
  handleSelectedItemChange: (item: string) => void
}

const SearchAutocomplete: FC<Props> = observer(
  ({selectedItem, handleSelectedItemChange}) => {
    const {categories} = useCategoriesStore()
    const {t} = useTranslation()
    const [inputItems, setInputItems] = useState([])
    const router = useRouter()
    const onInputValueChange = useCallback(
      debounce(({inputValue}) => {
        handleSelectedItemChange(inputValue)

        if (!inputValue) return setInputItems([])
        return makeRequest({
          method: 'get',
          url: '/api/search-suggestions',
          params: {search: inputValue.trim()},
        }).then((res) => {
          setInputItems(
            res.data
              // eslint-disable-next-line camelcase
              .map((i: {path_id: string[]; path_word: string[]}) => {
                if (isString(i)) {
                  return {primary: i}
                }
                if (isObject(i)) {
                  const slugs = getCategoriesSlugsPathFromIds(
                    i.path_id,
                    categories,
                  )
                  return {
                    primary: last(i.path_word),
                    secondary: i.path_word.slice(0, -1).join(' / '),
                    path: slugs.join('/'),
                  }
                }
                return {}
              })
              .filter((i) => i.primary || i.secondary)
              .slice(0, 10),
          )
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
      selectedItem,
      // @ts-ignore
      onSelectedItemChange: handleSelectedItemChange,
      onInputValueChange,
    })

    const redirect = (searchItem) => {
      const currentItem =
        highlightedIndex !== -1 ? inputItems[highlightedIndex] : null
      let pathname = `/${getLocationCodes()}`

      if (currentItem) {
        if (currentItem.path) pathname = `${pathname}/${currentItem.path}`
      } else if (searchItem) {
        if (searchItem.path) pathname = `${pathname}/${searchItem.path}`
      }
      router.push({
        pathname,
        query: {
          ...(searchItem.path ? {} : {q: searchItem.primary.trim()}),
        },
      })
    }

    return (
      <div className='flex flex-col w-full'>
        <div className='flex' {...getComboboxProps()}>
          <input
            {...getInputProps({
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  // @ts-ignore
                  e.nativeEvent.preventDownshiftDefault = true
                  // @ts-ignore
                  const {value} = e.target
                  redirect({primary: value})
                }
              },
            })}
            placeholder={t('SEARCH')}
            className='pl-6 pl-3.5 pr-12 py-2.5 text-greyscale-900 max-h-[38px] text-body-14 rounded-2 w-full h-full -my-1px'
            id='search-autocomplete'
          />
        </div>
        <ul
          {...getMenuProps()}
          className='z-10 bg-white shadow-xl absolute top-10 w-full'>
          {!isOpen &&
            inputItems.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
              <li
                {...getItemProps({item, index})}
                onClick={() => {
                  closeMenu()
                  redirect(item)
                }}
                className={`flex flex-col h-14 px-4 py-3 justify-center  ${
                  highlightedIndex === index ? 'bg-primary-100' : ''
                }`}
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.secondary}${index}`}>
                <span className='text-body-14 text-greyscale-900 truncate'>
                  {item.primary}
                </span>
                <span className='text-body-12 text-black-c truncate'>
                  {item.secondary}
                </span>
              </li>
            ))}
        </ul>
      </div>
    )
  },
)

export default SearchAutocomplete
