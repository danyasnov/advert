import React, {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcSearch from 'icons/material/Search.svg'
import List, {IList} from './List'

const ListWithFilter: FC<IList & {isSearchable?: boolean}> = (props) => {
  const {items, isMulti, onChange, value, isSearchable} = props
  const {t} = useTranslation()
  const [filtered, setFiltered] = useState(items)
  const [filter, setFilter] = useState('')
  const onClose = () => {
    setFilter('')
    setFiltered(items)
    if (props.onClose) props.onClose()
  }
  return (
    <div className='w-full flex flex-col h-full'>
      {isSearchable && (
        <div className='w-full px-4 relative mt-px'>
          <IcSearch className='w-6 h-6 absolute top-3 left-5 text-greyscale-800' />
          <input
            className='w-full h-12 border border-nc-border flex rounded-lg py-4 pr-4 pl-8 text-greyscale-900'
            placeholder={t('SEARCH')}
            value={filter}
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
