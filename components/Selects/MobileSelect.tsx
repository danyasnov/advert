import React, {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import {isArray, isEmpty, size} from 'lodash'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {CloseSquare} from 'react-iconly'
import {useWindowSize} from 'react-use'
import {SelectProps} from './Select'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {IconItem} from './IconSelect'
import List from './List'
import ListWithFilter from './ListWithFilter'

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
  const {width} = useWindowSize()
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)

  const [height, setHeight] = useState<number>(0)

  const onClose = () => {
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
    const itemSize = width < 768 ? 102 : 72
    const columnLength =
      options.length / 3 > 4 ? 4 : Math.ceil(options.length / 4)
    const bodyHeight = columnLength * itemSize + (columnLength - 1) * 8
    body = (
      <div
        style={{height: `${bodyHeight}px`}}
        className='w-full grid grid-cols-3 gap-2 px-4 h-full overflow-y-scroll'>
        {open &&
          options.map((f) => {
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
      <div className='w-full flex flex-col h-full'>
        {open && (
          <ListWithFilter
            isMulti={isMulti}
            items={options}
            value={value}
            onChange={onChange}
            onClose={onClose}
            isSearchable={isSearchable}
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
          className={`w-full pl-5 pr-6 ${
            classNameOpt?.valueContainer ? classNameOpt.valueContainer : 'py-4 '
          }`}>
          <div
            className={`flex justify-between items-center ${
              classNameOpt?.singleValue
                ? classNameOpt.singleValue
                : 'text-body-16'
            }`}>
            {isEmptyValue ? (
              <span className='text-greyscale-500 truncate'>{placeholder}</span>
            ) : (
              <span className='text-greyscale-900 truncate max-w-xs'>
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
        }}
        header={
          <div className='bg-white w-full flex flex-col pt-5 pb-2'>
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
          </div>
        }
        footer={
          isMulti && (
            <div className='h-20 flex w-full p-4 space-x-2 bg-white drop-shadow-card'>
              <SecondaryButton
                className='w-full h-full'
                disabled={!size(value as unknown as object)}
                onClick={() => {
                  // @ts-ignore
                  onChange([])
                }}>
                {t('RESET')}
              </SecondaryButton>
              <PrimaryButton className='w-full' onClick={onClose}>
                {t('DONE')}
              </PrimaryButton>
            </div>
          )
        }>
        <div className='flex flex-col items-center justify-center w-full'>
          {body}
        </div>
      </BottomSheet>
    </div>
  )
}

export default MobileSelect
