/* eslint-disable react/jsx-props-no-spreading */
import React, {FC, useEffect, useState} from 'react'
import {useSelect} from 'downshift'
import NumberFormat from 'react-number-format'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import {useTranslation} from 'next-i18next'
import IcSearch from 'icons/material/Search.svg'
import IcCheck from 'icons/material/Check.svg'
import {Country} from '../types'
import {handleMetrics} from '../helpers'

interface CountryOption {
  label: string
  value: string
  phonePrefix: string
  phoneMask: string
  phoneLength: number
  isoCode: string
}

interface PhoneInputProps {
  countriesOptions: CountryOption[]
  onChange: (val: string) => void
  onChangeFormat: (val: Country) => void
  format: string
  country: Country
  value: string
}
const PhoneInput: FC<PhoneInputProps> = ({
  countriesOptions,
  format,
  onChange,
  country,
  value,
  onChangeFormat,
}) => {
  return (
    <div className='flex border-2 border-nc-primary rounded-lg h-12 w-full items-center'>
      <FormatSelect
        countriesOptions={countriesOptions}
        value={country}
        onChange={(val) => {
          onChangeFormat(val)
        }}
      />

      <div className='h-8 w-[0.5px] bg-nc-title mx-2' />

      <NumberFormat
        onValueChange={({value: inputValue}) => {
          onChange(inputValue)
          handleMetrics('addAdvt_priceItems')
        }}
        value={value}
        mask='_'
        format={format}
        className='rounded-lg py-3 w-full text-greyscale-900 text-body-16 outline-none manual-outline'
      />
    </div>
  )
}

interface FormatSelectorProps {
  countriesOptions: CountryOption[]
  onChange: (val: CountryOption) => void
  value: Country
}
const FormatSelect: FC<FormatSelectorProps> = ({
  countriesOptions,
  value,
  onChange,
}) => {
  const [filter, setFilter] = useState('')
  const {t} = useTranslation()
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    closeMenu,
  } = useSelect({
    items: countriesOptions,
    onSelectedItemChange: ({selectedItem: val}) => {
      onChange(val)
    },
  })
  useEffect(() => {
    if (isOpen === false) {
      setFilter('')
    }
  }, [isOpen])

  return (
    <div className='flex items-center relative'>
      <button
        {...getToggleButtonProps()}
        className='ml-3 flex items-center'
        type='button'>
        <IcArrowDropDown className='w-6 h-6 fill-current text-black-c mr-2' />

        <span className='text-body-16 text-greyscale-900'>
          +{value.phonePrefix}
        </span>
      </button>
      {isOpen && (
        <ul
          {...getMenuProps()}
          className='max-h-[297px] w-[412px] z-30 absolute top-10 left-0 overflow-y-scroll bg-white border border-nc-border rounded-lg pb-2'>
          <div className='relative'>
            <div className='flex mx-2 pt-4 mb-2 pb-3 border-b border-nc-border sticky top-0 bg-white'>
              <IcSearch className='w-5 h-5 mr-2' />
              <input
                className='w-full text-body-16 text-greyscale-900 manual-outline outline-none'
                placeholder={t('SEARCH')}
                value={filter}
                onChange={({target}) => setFilter(target.value)}
              />
            </div>
            {countriesOptions.map((item, index) => {
              let hide
              if (!filter) {
                hide = false
              } else {
                hide = !item.label.toLowerCase().includes(filter.toLowerCase())
              }

              return (
                <li
                  className={`${
                    highlightedIndex === index ? 'bg-nc-accent' : ''
                  } h-12 rounded-lg flex items-center px-4 mx-2 justify-between ${
                    hide ? 'hidden' : ''
                  } `}
                  key={item.isoCode}
                  {...getItemProps({item, index})}>
                  <span className='text-body-16 text-greyscale-900'>
                    {item.label}
                  </span>
                  {item.value === value.value && (
                    <IcCheck className='fill-current text-primary-500 w-3 h-3' />
                  )}
                </li>
              )
            })}
          </div>
        </ul>
      )}
    </div>
  )
}

export default PhoneInput
