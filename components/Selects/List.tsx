import React, {FC} from 'react'
import {size} from 'lodash'
import IcCheck from 'icons/material/Check.svg'
import {FixedSizeList} from 'react-window'
import {SelectItem} from './Select'
import Button from '../Buttons/Button'

const ROWS = 8
const OPTION_HEIGHT = 55
export interface IList {
  items: SelectItem[]
  value: SelectItem | SelectItem[]
  isMulti?: boolean
  onChange: (value) => void
  onClose?: () => void
}
const List: FC<IList> = ({items, isMulti, onChange, value, onClose}) => {
  // console.log(value)
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
                  if (onClose) onClose()
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

export default List
