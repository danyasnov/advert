import React, {FC, useRef, useState} from 'react'
import {isArray, isEmpty, size} from 'lodash'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {SelectItem, SelectProps} from './Select'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import Button from '../Buttons/Button'

const IconSelect: FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isMulti,
  isInvalid,
  classNameOpt,
  isIconSelect,
}) => {
  const ref = useRef()

  const [show, setShow] = useState(false)
  useOnClickOutside(ref, () => {
    setShow(false)
  })
  let isEmptyValue
  if (Array.isArray(value)) {
    isEmptyValue = isEmpty(value)
  } else {
    isEmptyValue = !value?.value && value?.value !== 0
  }
  return (
    <div
      className='relative w-full bg-greyscale-50 rounded-xl py-2.5 h-fit'
      ref={ref}>
      <Button className='w-full pl-5 pr-7' onClick={() => setShow(!show)}>
        <div className='flex justify-between items-center w-full text-body-12'>
          {isEmptyValue ? (
            <span className='text-greyscale-500 truncate'>{placeholder}</span>
          ) : (
            <span className='text-greyscale-900 flex truncate'>
              {isArray(value)
                ? value.map((v) => v.label).join(', ')
                : value.label}
            </span>
          )}
          <IcArrowDown
            className={`fill-current text-greyscale-900 h-5 w-5 -mr-2 shrink-0 ${
              show ? 'rotate-180' : ''
            }`}
          />
        </div>
      </Button>
      {show && (
        <div
          className={`absolute flex rounded-2xl shadow-1 top-14 bg-white z-10 px-4 py-5  ${
            options.length >= 12 ? 'w-[288px]' : ''
          }`}>
          <div
            className={`grid grid-cols-[repeat(3,72px)] gap-x-3 gap-y-4 max-h-[336px] overflow-y-scroll scrollbar ${
              options.length >= 12 ? 'pr-3' : ''
            }`}>
            {options.map((f) => {
              // @ts-ignore
              const isSelected = value.some((v) => v.value === f.value)
              return (
                <IconItem
                  item={f}
                  value={value}
                  isSelected={isSelected}
                  isMulti={isMulti}
                  onChange={onChange}
                  onClose={() => setShow(false)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface IconItemProps {
  item: SelectItem
  value: SelectItem

  isSelected: boolean
  isMulti: boolean
  onChange
  onClose
}
export const IconItem: FC<IconItemProps> = ({
  item,
  value,
  isSelected,
  isMulti,
  onChange,
  onClose,
}) => {
  return (
    <Button
      // @ts-ignore
      disabled={item.disabled}
      key={item.value}
      className='w-[102px] h-[102px] s:w-[72px] s:h-[72px]'
      onClick={() => {
        if (isMulti) {
          // @ts-ignore
          const newFiltered = value.filter((v) => v.value !== item.value)
          if (size(value) !== size(newFiltered)) {
            onChange(newFiltered)
          } else {
            // @ts-ignore
            onChange([...value, item])
          }
        } else {
          onChange(item)
          onClose()
        }
      }}>
      <div
        className={`w-[102px] h-[102px] s:w-[71px] s:h-[71px] border-2 s:border border-primary-500 rounded-3xl s:rounded-xl flex flex-col items-center justify-center ${
          isSelected ? 'bg-primary-500 text-white' : ''
        }`}>
        <img
          src={item.icon}
          alt={item.label}
          className={`${
            isSelected ? 'invert brightness-0' : ''
          } w-16 h-16 s:w-12 s:h-12`}
        />
        <span className='truncate w-full font-medium text-body-10 px-1 pb-2'>
          {item.label}
        </span>
      </div>
    </Button>
  )
}

export default IconSelect
