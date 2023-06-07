import React, {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcSearch from 'icons/material/Search.svg'
import {Search} from 'react-iconly'
import List, {IList} from './List'

const ListWithFilter: FC<IList & {isSearchable?: boolean}> = (props) => {
  const {items, isMulti, onChange, value, isSearchable} = props
  const {t} = useTranslation()
  const [filtered, setFiltered] = useState(items)
  const [focused, setFocused] = useState(false)
  const [filter, setFilter] = useState('')
  const onClose = () => {
    setFilter('')
    setFiltered(items)
    if (props.onClose) props.onClose()
  }
  return (
    <div className='w-full flex flex-col h-full'>
      {isSearchable && (
        <div className='w-full px-4 relative mt-6'>
          {/* <IcSearch className='w-5 h-5 absolute top-2.5 left-6 text-greyscale-400' /> */}
          <div
            className={`absolute top-2.5 left-8 ${
              focused ? 'text-primary-500' : 'text-greyscale-400'
            } `}>
            <Search set='light' size={20} />
          </div>
          <input
            className='w-full h-10 border border-nc-border flex rounded-xl py-4 pr-4 pl-11 text-greyscale-900'
            placeholder={t('SEARCH')}
            value={filter}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={({target}) => {
              setFilter(target.value)
              setFiltered(
                items.filter((o) => {
                  return o.label
                    .toLowerCase()
                    .includes(target.value.toLowerCase())
                }),
              )
            }}
          />
        </div>
      )}
      <div className='h-full mt-2'>
        <List
          items={filtered}
          value={value}
          isMulti={isMulti}
          onChange={onChange}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export default ListWithFilter
