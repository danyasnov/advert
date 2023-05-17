import React, {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import {isArray, isEmpty, size} from 'lodash'
import IcCheck from 'icons/material/Check.svg'
import IcSearch from 'icons/material/Search.svg'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {CloseSquare} from 'react-iconly'
import {FixedSizeList} from 'react-window'
import {SelectItem, SelectProps} from './Select'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {IconItem} from './IconSelect'

const ROWS = 8
const OPTION_HEIGHT = 55
const MobileSelect: FC<SelectProps> = ({
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
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState(options)
  const [filter, setFilter] = useState('')
  const [height, setHeight] = useState<number>(0)

  const onClose = () => {
    setFilter('')
    setFiltered(options)
    setOpen(false)
  }

  let isEmptyValue
  if (Array.isArray(value)) {
    isEmptyValue = isEmpty(value)
  } else {
    isEmptyValue = !value?.value && value?.value !== 0
  }

  let body

  if (isIconSelect) {
    body = (
      <div
        className={`w-full grid grid-cols-3 gap-2 px-4 ${
          isMulti ? 'mb-20' : 'mb-10'
        }  ${isSearchable ? 'mt-25' : 'mt-15'}`}>
        {open &&
          filtered.map((f) => {
            // @ts-ignore
            const isSelected = Array.isArray(value)
              ? value.some((v) => v.value === f.value)
              : value.value === f.value
            return (
              <div className='flex justify-center'>
                <IconItem
                  item={f}
                  value={value}
                  isSelected={isSelected}
                  isMulti={isMulti}
                  onChange={onChange}
                  onClose={onClose}
                />
              </div>
            )
          })}
      </div>
    )
  } else {
    body = (
      <div
        className={`w-full flex flex-col ${isMulti ? 'mb-20' : 'mb-10'} ${
          isSearchable ? 'mt-25' : 'mt-10'
        }`}>
        {open && (
          <List
            isMulti={isMulti}
            items={filtered}
            value={value}
            onChange={onChange}
            onClose={onClose}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <Button
        className={`border rounded-lg w-full bg-greyscale-50 ${
          isInvalid ? 'border-error' : 'border-transparent'
        } `}
        onClick={() => setOpen(true)}>
        <div
          className={` w-full pl-5 pr-6 ${
            classNameOpt.valueContainer ? classNameOpt.valueContainer : 'py-4 '
          }`}>
          <div
            className={`flex justify-between items-center ${
              classNameOpt.singleValue
                ? classNameOpt.singleValue
                : 'text-body-16'
            }`}>
            {isEmptyValue ? (
              <span className='text-greyscale-500 truncate'>{placeholder}</span>
            ) : (
              <span className='text-greyscale-900 truncate'>
                {isArray(value)
                  ? value.map((v) => v.label).join(', ')
                  : value.label}
              </span>
            )}
            <IcArrowDown className='fill-current text-greyscale-900 shrink-0 h-5 w-5 -mr-2' />
          </div>
        </div>
      </Button>
      <BottomSheet
        open={open}
        onDismiss={() => {
          onClose()
        }}
        snapPoints={({minHeight}) => {
          if (!height) {
            setHeight(minHeight)
            return minHeight
          }
          return height
        }}>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='fixed top-5 bg-white w-full flex flex-col pt-5'>
            <div className='flex w-full mb-2 px-4 text-center relative'>
              <h3 className='text-h-6 font-medium text-greyscale-900 w-full'>
                {placeholder}
              </h3>
              <Button
                className='text-primary-500 absolute inset-y-0 right-4'
                onClick={() => {
                  setOpen(false)
                }}>
                <CloseSquare size={24} />
              </Button>
            </div>

            {isSearchable && (
              <div className='w-full px-4 relative mt-5'>
                <IcSearch className='w-6 h-6 absolute top-3 left-5 text-greyscale-800' />
                <input
                  className='w-full h-12 border border-nc-border flex rounded-lg py-4 pr-4 pl-8 text-greyscale-900'
                  placeholder={t('SEARCH')}
                  value={filter}
                  onChange={({target}) => {
                    setFilter(target.value)
                    setFiltered(
                      options.filter((o) => {
                        return o.label
                          .toLowerCase()
                          .includes(target.value.toLowerCase())
                      }),
                    )
                  }}
                />
              </div>
            )}
          </div>
          {body}
          {isMulti && (
            <div className='h-20 flex w-full fixed bottom-0 p-4 space-x-2 bg-white drop-shadow-card'>
              <SecondaryButton
                className='w-full h-full'
                disabled={!size(value as unknown as object)}
                onClick={() => {
                  setFilter('')
                  setFiltered(options)
                  // @ts-ignore
                  onChange([])
                }}>
                {t('RESET')}
              </SecondaryButton>
              <PrimaryButton className='w-full' onClick={onClose}>
                {t('DONE')}
              </PrimaryButton>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}

interface IList {
  items: SelectItem[]
  value: SelectItem | SelectItem[]
  isMulti: boolean
  onChange: (value) => void
  onClose?: () => void
}
export const List: FC<IList> = ({items, isMulti, onChange, value, onClose}) => {
  return (
    <FixedSizeList
      height={
        items.length >= ROWS
          ? OPTION_HEIGHT * ROWS
          : items.length * OPTION_HEIGHT
      }
      itemCount={items.length}
      itemSize={55}>
      {({index, style}) => {
        const f = items[index]
        return (
          <div style={style}>
            <Button
              // @ts-ignore
              disabled={f.disabled}
              key={f.value}
              className={`w-full px-4 border-b ${
                index === items.length - 1
                  ? 'border-transparent'
                  : 'border-nc-border'
              } ${
                // @ts-ignore
                f.disabled ? 'text-greyscale-900' : ''
              }`}
              onClick={() => {
                if (isMulti) {
                  // @ts-ignore
                  const newFiltered = value.filter((v) => v.value !== f.value)
                  if (size(value) !== size(newFiltered)) {
                    onChange(newFiltered)
                  } else {
                    // @ts-ignore
                    onChange([...value, f])
                  }
                } else {
                  onChange(f)
                  onClose && onClose()
                }
              }}>
              <div className='w-full flex items-center justify-between py-4'>
                <div className='flex space-x-3'>
                  {!!f.icon && (
                    <img src={f.icon} alt={f.label} width={20} height={20} />
                  )}
                  <span className='text-body-16 text-nc-text-primary'>
                    {f.label}
                  </span>
                </div>
                {isMulti && !f.disabled && (
                  <>
                    <input
                      type='checkbox'
                      readOnly
                      checked={
                        // @ts-ignore
                        value.some((v) => v.value === f.value)
                      }
                      className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
                    />
                    <div className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex shrink-0 justify-center items-center mr-2'>
                      <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
                    </div>
                  </>
                )}
                {!Array.isArray(value) &&
                  f.value === value?.value &&
                  !isMulti && (
                    <IcCheck className='fill-current text-primary-500 h-4 w-4' />
                  )}
              </div>
            </Button>
          </div>
        )
      }}
    </FixedSizeList>
  )
}

export default MobileSelect
